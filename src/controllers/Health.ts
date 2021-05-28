import {
  controller, httpGet, httpPost, httpPut, httpDelete
} from 'inversify-express-utils';
import { inject, named } from 'inversify';
import { Request } from 'express';


@controller('/health')
export class MutatingWebhook {

  constructor() { }

  @httpPost('/liveliness')
  public async livelinessProbe(request: Request): Promise<any> {
    return Promise.resolve("alive");
  }

  @httpPost('/readiness')
  public async readinessProbe(request: Request): Promise<any> {
    return Promise.resolve("ready");
  }
}