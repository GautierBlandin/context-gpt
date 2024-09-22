import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma-client/auth';

@Injectable()
export class PrismaService extends PrismaClient {}
