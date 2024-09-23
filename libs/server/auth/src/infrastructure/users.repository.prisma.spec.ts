import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './users.repository.prisma';
import { User } from '../domain/user.aggregate';

describe('PrismaUsersRepository', () => {
  let prismaService: PrismaService;
  let repository: PrismaUsersRepository;

  beforeEach(async () => {
    prismaService = new PrismaService({
      datasourceUrl: process.env['TEST_DATABASE_URL_AUTH'],
    });
    repository = new PrismaUsersRepository(prismaService);

    await prismaService.user.deleteMany();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  describe('save', () => {
    it('should save a new user', async () => {
      const user = User.from({
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        type: 'active',
      });

      await repository.save(user);

      const savedUser = await prismaService.user.findUnique({
        where: { email: 'test@example.com' },
      });

      expect(savedUser).toBeDefined();
      expect(savedUser?.id).toBe('123');
      expect(savedUser?.email).toBe('test@example.com');
      expect(savedUser?.hashedPassword).toBe('hashedPassword');
    });

    it('should update an existing user', async () => {
      const user = User.from({
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'hashedPassword',
        type: 'active',
      });

      await repository.save(user);

      const updatedUser = User.from({
        id: '123',
        email: 'test@example.com',
        hashedPassword: 'newHashedPassword',
        type: 'active',
      });

      await repository.save(updatedUser);

      const savedUser = await prismaService.user.findUnique({
        where: { email: 'test@example.com' },
      });

      expect(savedUser).toBeDefined();
      expect(savedUser?.hashedPassword).toBe('newHashedPassword');
    });
  });

  describe('getByEmail', () => {
    it('should return a user when found', async () => {
      await prismaService.user.create({
        data: {
          id: '123',
          email: 'test@example.com',
          hashedPassword: 'hashedPassword',
          type: 'ACTIVE',
        },
      });

      const user = await repository.getByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.state.id).toBe('123');
      expect(user?.state.email).toBe('test@example.com');
      expect(user?.state.hashedPassword).toBe('hashedPassword');
    });

    it('should return null when user is not found', async () => {
      const user = await repository.getByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });
});
