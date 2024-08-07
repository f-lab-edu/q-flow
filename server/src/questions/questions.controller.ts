import { Body, Controller, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { SaveQuestionDto } from './dto/save-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  public async saveQuestion(@Body() dto: SaveQuestionDto) {
    await this.questionsService.saveQuestion(dto.title);
  }
}
