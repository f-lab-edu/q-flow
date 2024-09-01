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

  public async getQuestions(
    page: number,
    countPerPage: number,
  ): Promise<{ questions: Question[]; totalCount: number }> {
    const questions = await this.prisma.question.findMany({
      skip: (page - 1) * countPerPage,
      take: countPerPage,
    });
    const totalCount = await this.prisma.question.count();
    return {
      questions,
      totalCount,
    };
  }
}
