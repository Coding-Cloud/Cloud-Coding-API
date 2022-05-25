import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyCommentModule } from '../../../usecases-proxy/comment/use-cases-proxy-comment.module';
import { FindProjectCommentsUseCase } from '../../../../usecases/comment/find-project-comments.usecase';
import { CommentListDto } from './dto/comment-list.dto';
import { FindUserPublicCommentsUseCase } from '../../../../usecases/comment/find-user-comments.usecase';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AddProjectCommentUseCase } from '../../../../usecases/comment/add-project-comment.usecase';
import { DeleteProjectCommentUseCase } from '../../../../usecases/comment/delete-project-comment.usecase';
import { IsCommentOwnerGuard } from './comment-owner.guards';

@Controller('comments')
@ApiTags('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    @Inject(UseCasesProxyCommentModule.FIND_PROJECT_COMMENTS_USE_CASES_PROXY)
    private readonly findProjectComments: UseCaseProxy<FindProjectCommentsUseCase>,
    @Inject(
      UseCasesProxyCommentModule.FIND_USER_PUBLIC_COMMENTS_USE_CASES_PROXY,
    )
    private readonly findUserPublicComments: UseCaseProxy<FindUserPublicCommentsUseCase>,
    @Inject(UseCasesProxyCommentModule.ADD_PROJECT_COMMENT_USE_CASES_PROXY)
    private readonly addProjectComment: UseCaseProxy<AddProjectCommentUseCase>,
    @Inject(UseCasesProxyCommentModule.DELETE_PROJECT_COMMENT_USE_CASES_PROXY)
    private readonly deleteProjectComment: UseCaseProxy<DeleteProjectCommentUseCase>,
  ) {}

  @ApiOperation({ summary: 'Get comments of project' })
  @Get('/project/:projectId')
  async findCommentsByProjectId(
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

  @ApiOperation({ summary: 'Get public comments of user' })
  @Get('/user/:userId')
  async findCommentsByUserId(
    @Param('userId') userId: string,
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<CommentListDto> {
    const [comments, totalResults] = await this.findUserPublicComments
      .getInstance()
      .findUserPublicComments(userId, search, limit, offset);
    return { comments, totalResults };
  }

  @ApiOperation({ summary: 'Add new comment' })
  @Post()
  async addComment(
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<string> {
    return await this.addProjectComment.getInstance().addProjectCommentUseCase({
      ownerId: user.id,
      projectId: createCommentDto.projectId,
      content: createCommentDto.content,
    });
  }

  @ApiOperation({ summary: 'Delete comment' })
  @UseGuards(IsCommentOwnerGuard)
  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: string): Promise<void> {
    return await this.deleteProjectComment
      .getInstance()
      .deleteProjectCommentUseCase(commentId);
  }
}
