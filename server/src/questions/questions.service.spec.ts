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
    await prismaService.question.deleteMany();
  });

  afterEach(async () => {
    await prismaService.question.deleteMany();
  });

  it('should save a question', async () => {
    // given
    const title = 'Test Question';

    // when
    await service.saveQuestion(title);

    // then
    const savedQuestion = await prismaService.question.findFirst({
      where: { title },
    });
    expect(savedQuestion).toBeDefined();
    expect(savedQuestion.title).toBe(title);
  });

  it('should get all questions', async () => {
    // given
    const title1 = 'Test Question 1';
    await service.saveQuestion(title1);
    const title2 = 'Test Question 2';
    await service.saveQuestion(title2);
    const title3 = 'Test Question 3';
    await service.saveQuestion(title3);

    // when
    const questions = await service.getAllQuestions();

    // then
    expect(questions).toBeDefined();
    expect(questions.length).toBe(3);
    expect(questions[0].title).toBe(title1);
    expect(questions[1].title).toBe(title2);
    expect(questions[2].title).toBe(title3);
  });
});
