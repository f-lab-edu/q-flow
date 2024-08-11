import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../database/prisma.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService, PrismaService],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.question.deleteMany();
  });

  it('should save a question', async () => {
    // given
    const title = 'Test Question';
    await service.saveQuestion(title);

    // when
    const savedQuestion = await prismaService.question.findFirst({
      where: { title },
    });

    // then
    expect(savedQuestion).toBeDefined();
    expect(savedQuestion.title).toBe(title);
  });
});
