import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('')
export class BaseController {
  @ApiOperation({ summary: 'Hello world' })
  @Get('/')
  getUser(): string {
    return 'Hello World!';
  }
}
