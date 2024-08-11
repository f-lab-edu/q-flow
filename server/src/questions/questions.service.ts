import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Question } from '@prisma/client';

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

  public getAllQuestions(): Promise<Question[]> {
    return this.prisma.question.findMany({});
  }
}
