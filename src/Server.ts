import { server } from "ioc";
import { inject, named } from "inversify";
import { APP } from "CONST";
import { interfaces } from "inversify-express-utils";
import { Application } from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";

@server()
export class ExpressServer implements Server {

  private config: ExternalDdnsConfig;

  private cron: Server;

  private server: http.Server;

  constructor(
    @inject(APP.CONFIG)
    config: ExternalDdnsConfig,
    @inject(APP.APP_FACTORY)
    buildApp: (configure: interfaces.ConfigFunction)=>any,
    @inject(APP.SERVICE)
    @named("cron")
    cron: Server
  ) {
    this.config = config;
    this.cron = cron;
    this.setServer(buildApp((app) => {
      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(bodyParser.json());
      app.use(helmet());
    }));
  }

  public async start(): Promise<void> {
    const port = this.config.port;
    return new Promise((resolve) => {
      this.server.listen(port, async ()=> {
        console.log(`Server started on port ${port}`);
        await this.cron.start();
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        this.cron.stop();
        if (err) reject(err);
        resolve();
      })
    })
  }

  private setServer(app: Application): void {
    const options: https.ServerOptions & http.ServerOptions = {};
    let srv: typeof http | typeof https;
    if (this.config.sslEnabled) {
      options.key = fs.readFileSync(this.config.sslKey);
      options.cert = fs.readFileSync(this.config.sslCert);
      srv = https;
    } else {
      srv = http;
    }
    this.server = srv.createServer(options, app);
  }

}