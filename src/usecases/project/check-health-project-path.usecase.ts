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
      const res = await this.httpService.get(codeRunnerUrl).toPromise();

      return res.status === 200;
    } catch (error) {
      Logger.debug("can't contact the path" + codeRunnerUrl);
      return false;
    }
  }
}
