import { UsersRepository } from '../ports/users.repository';
import { User } from '../domain/user.aggregate';
import { User as PrismaUser, UserType } from '@prisma-client/auth';
import { PrismaService } from './prisma/prisma.service';
import { Inject } from '@nestjs/common';

export class PrismaUsersRepository extends UsersRepository {
  constructor(@Inject() private readonly prismaService: PrismaService) {
    super();
  }

  async save(user: User): Promise<void> {
    const { id, email, hashedPassword } = user.state;
    await this.prismaService.user.upsert({
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
    const user = await this.prismaService.user.findUnique({
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
