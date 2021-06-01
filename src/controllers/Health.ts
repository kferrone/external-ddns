import { controller, httpGet } from 'inversify-express-utils';

@controller('/health')
export class HealthMonitor {

  constructor() { }

  @httpGet('/liveliness')
  public async livelinessProbe(): Promise<any> {
    return Promise.resolve({status: "alive"});
  }

  @httpGet('/readiness')
  public async readinessProbe(): Promise<any> {
    return Promise.resolve({status: "ready"});
  }
}