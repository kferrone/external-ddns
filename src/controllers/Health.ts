import {
  controller, httpGet, httpPost, httpPut, httpDelete
} from 'inversify-express-utils';
import { inject, named } from 'inversify';
import { Request } from 'express';


@controller('/health')
export class HealthMonitor {

  constructor() { }

  @httpGet('/liveliness')
  public async livelinessProbe(request: Request): Promise<any> {
    return Promise.resolve({status: "alive"});
  }

  @httpGet('/readiness')
  public async readinessProbe(request: Request): Promise<any> {
    return Promise.resolve({status: "ready"});
  }
}