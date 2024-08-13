import * as aws from '@pulumi/aws';
import * as synced from '@pulumi/synced-folder';
import * as pulumi from '@pulumi/pulumi';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('next-static');

new synced.S3BucketFolder('synced-folder', {
  path: '../../apps/context-gpt/out',
  bucketName: bucket.bucket,
  acl: 'private',
});

// Create a VPC (we'll use the default VPC for simplicity)
const vpc = new aws.ec2.Vpc('my-vpc', {
  cidrBlock: '10.242.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: {
    Name: 'my-vpc',
  },
});

// Create a public subnet
const publicSubnet = new aws.ec2.Subnet('public-subnet', {
  vpcId: vpc.id,
  cidrBlock: '10.242.1.0/24',
  mapPublicIpOnLaunch: true,
  availabilityZone: 'us-east-1a', // Replace with your desired AZ
  tags: {
    Name: 'public-subnet',
  },
});

// Create an Internet Gateway
const internetGateway = new aws.ec2.InternetGateway('my-ig', {
  vpcId: vpc.id,
  tags: {
    Name: 'my-ig',
  },
});

// Create a route table
const routeTable = new aws.ec2.RouteTable('public-rt', {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: '0.0.0.0/0',
      gatewayId: internetGateway.id,
    },
  ],
  tags: {
    Name: 'public-rt',
  },
});

// Associate the route table with the public subnet
const routeTableAssociation = new aws.ec2.RouteTableAssociation('public-rta', {
  subnetId: publicSubnet.id,
  routeTableId: routeTable.id,
});

// Create an ECS cluster
const cluster = new aws.ecs.Cluster('dev-cluster');

// Create a security group for the EC2 instances
const instanceSg = new aws.ec2.SecurityGroup('instance-sg', {
  vpcId: vpc.id,
  ingress: [{ protocol: 'tcp', fromPort: 0, toPort: 65535, cidrBlocks: ['0.0.0.0/0'] }],
  egress: [{ protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }],
});

// Create an IAM role for the EC2 instances
const instanceRole = new aws.iam.Role('instance-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: 'ec2.amazonaws.com' }),
});

// Attach the necessary policies to the instance role
new aws.iam.RolePolicyAttachment('ecs-instance-role-attachment', {
  role: instanceRole.name,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role',
});

// Create an instance profile
const instanceProfile = new aws.iam.InstanceProfile('instance-profile', {
  role: instanceRole.name,
});

// Create a launch template for the EC2 instances
const launchTemplate = new aws.ec2.LaunchTemplate('launch-template', {
  instanceType: 't2.micro',
  imageId: aws.ec2
    .getAmi({
      owners: ['amazon'],
      mostRecent: true,
      filters: [{ name: 'name', values: ['amzn2-ami-ecs-hvm-*-x86_64-ebs'] }],
    })
    .then((ami) => ami.id),
  iamInstanceProfile: { arn: instanceProfile.arn },
  vpcSecurityGroupIds: [instanceSg.id],
  userData: pulumi.interpolate`${Buffer.from(
    `#!/bin/bash
echo ECS_CLUSTER=${cluster.name} >> /etc/ecs/ecs.config`,
  ).toString('base64')}`,
});

// Create an Auto Scaling Group
const asg = new aws.autoscaling.Group('asg', {
  vpcZoneIdentifiers: [publicSubnet.id],
  desiredCapacity: 1,
  maxSize: 1,
  minSize: 1,
  launchTemplate: {
    id: launchTemplate.id,
    version: '$Latest',
  },
});

// Create a capacity provider
const capacityProvider = new aws.ecs.CapacityProvider('capacity-provider', {
  autoScalingGroupProvider: {
    autoScalingGroupArn: asg.arn,
    managedTerminationProtection: 'DISABLED',
    managedScaling: {
      status: 'ENABLED',
      targetCapacity: 100,
    },
  },
});

// Associate the capacity provider with the cluster
new aws.ecs.ClusterCapacityProviders('cluster-capacity-providers', {
  clusterName: cluster.name,
  capacityProviders: [capacityProvider.name],
});

// Export the name of the bucket and cluster
export const bucketName = bucket.id;
export const clusterName = cluster.name;

export const vpcId = vpc.id;
export const publicSubnetId = publicSubnet.id;
