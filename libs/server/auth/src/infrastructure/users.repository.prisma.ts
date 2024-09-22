import { UsersRepository } from '../ports/users.repository';
import { User } from '../domain/user.aggregate';
import { PrismaClient, User as PrismaUser, UserType } from '@prisma/client';

export class PrismaUsersRepository implements UsersRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(user: User): Promise<void> {
    const { id, email, hashedPassword } = user.state;
    await this.prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        type: UserType.ACTIVE,
      },
      create: {
        id,
        email,
        hashedPassword,
        type: UserType.ACTIVE,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.mapPrismaUserToDomainUser(user);
  }

  private mapPrismaUserToDomainUser(prismaUser: PrismaUser): User {
    return User.from({
      id: prismaUser.id,
      email: prismaUser.email,
      hashedPassword: prismaUser.hashedPassword,
      type: 'active',
    });
  }
}
