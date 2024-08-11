import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  public async saveQuestion(title: string) {
    await this.prisma.question.create({
      data: {
        title,
      },
    });
  }
}
