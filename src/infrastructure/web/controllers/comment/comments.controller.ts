import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyCommentModule } from '../../../usecases-proxy/comment/use-cases-proxy-comment.module';
import { FindProjectCommentsUseCase } from '../../../../usecases/comment/find-project-comments.usecase';
import { CommentListDto } from './dto/comment-list.dto';

@Controller('comments')
@ApiTags('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    @Inject(UseCasesProxyCommentModule.FIND_PROJECT_COMMENTS_USE_CASES_PROXY)
    private readonly findProjectComments: UseCaseProxy<FindProjectCommentsUseCase>,
  ) {}

  @ApiOperation({ summary: 'Get comments of project' })
  @Get('/project/:projectId')
  async findById(
    @Param('projectId') projectId: string,
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<CommentListDto> {
    const [comments, totalResults] = await this.findProjectComments
      .getInstance()
      .findProjectComments(projectId, search, limit, offset);
    return { comments, totalResults };
  }
}
