import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma-client/threads';

@Injectable()
export class PrismaService extends PrismaClient {}
