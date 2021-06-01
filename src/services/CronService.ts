import { inject } from "inversify";
import { APP } from "CONST";
import * as cron from "node-cron";
import { service } from "ioc";

@service("cron")
export class CronService implements Applet {

  private schedule: string;

  private task: cron.ScheduledTask;

  constructor(
    @inject(APP.CONFIG)
    config: ExternalDdnsConfig
  ) {
    this.schedule = config.cronSchedule;
  }

  public start(): void {
    console.log(`Checking for new ip with schedule: ${this.schedule}`);
    this.task = cron.schedule(this.schedule, ()=> {
      console.log("Running the task");
      
    });
  }

  public stop(): void {
    this.task.destroy();
  }
}