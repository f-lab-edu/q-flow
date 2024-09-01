import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { SaveQuestionDto } from './dto/save-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  public async saveQuestion(@Body() dto: SaveQuestionDto) {
    await this.questionsService.saveQuestion(dto.title);
  }

  @Get()
  public async getQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.questionsService.getQuestions(Number(page), Number(limit));
  }
}
