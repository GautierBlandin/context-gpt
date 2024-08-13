import * as aws from '@pulumi/aws';
import * as synced from '@pulumi/synced-folder';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('next-static');

// Export the name of the bucket
export const bucketName = bucket.id;

new synced.S3BucketFolder('synced-folder', {
  path: '../../apps/context-gpt/out',
  bucketName: bucket.bucket,
  acl: 'private',
});
