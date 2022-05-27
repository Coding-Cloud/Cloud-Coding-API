import { CheckProjectHealthPath } from './types/check-project-health-path.interface';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export class CheckHealthProjectPathUsecase {
  constructor(private httpService: HttpService) {}

  async checkHealth(
    checkProjectHealthPath: CheckProjectHealthPath,
  ): Promise<boolean> {
    Logger.debug(checkProjectHealthPath);
    const codeRunnerUrl = checkProjectHealthPath.path;
    if (!codeRunnerUrl.includes('localhost')) {
      //TODO verif que le projet est bien celui du user
    }
    try {
      const headersRequest = {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      };
      const res = await this.httpService
        .get(codeRunnerUrl, { headers: headersRequest })
        .toPromise();
      console.log(res.status);
      return res.status === 200;
    } catch (error) {
      Logger.debug("can't contact the path" + codeRunnerUrl);
      Logger.debug(error);
      return true;
    }
  }
}
