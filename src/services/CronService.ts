import { inject, named } from "inversify";
import { APP } from "CONST";
import * as cron from "node-cron";
import { service } from "ioc";
import * as k8s from "@kubernetes/client-node";
import { KubeService } from "services/KubeService";

// Example of instantiating a Pod object.
const pod = {
} as k8s.V1Pod;

@service("cron")
export class CronService implements Server {

  private schedule: string;

  private task: cron.ScheduledTask;

  private ipService: IpService;

  private lastIP: string;

  private getIngresses: (ip: string)=>Promise<k8s.V1Ingress[]>;

  constructor(
    @inject(APP.CONFIG)
    config: ExternalDdnsConfig,
    @inject(APP.SERVICE)
    @named("ip")
    ipService: IpService,
    @inject(APP.RESOURCE_PROVIDER)
    @named("Ingress")
    getIngresses: (ip: string)=>Promise<k8s.V1Ingress[]>
  ) {
    this.schedule = config.cronSchedule;
    this.ipService = ipService;
    this.getIngresses = getIngresses

  }

  public async start(): Promise<void> {
    console.log(`Checking for new ip with schedule: ${this.schedule}`);
    // initialize the last ip with current ip so first round has something to look at
    this.lastIP = await this.ipService.getIpV4();
    this.task = cron.schedule(this.schedule, async ()=> {
      const ipNow = await this.ipService.getIpV4();
      console.log(`DDNS task running for current IP as ${ipNow}`);
      // if the new ip is different than the cached one we have some changes to make
      if (ipNow !== this.lastIP) {
        console.log(`IP has changed from ${this.lastIP} to ${ipNow}`);
        const ingresses = await this.getIngresses(ipNow);
        if (ingresses.length > 0) {
          // TODO: update all of the ingresses here
        }
        this.lastIP = ipNow;
      }
      const ingresses = await this.getIngresses("192.168.50.201");
      console.log("The ingresses", ingresses)
      
    });
  }

  public stop(): void {
    this.task.destroy();
  }
}