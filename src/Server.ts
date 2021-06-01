import { server } from "ioc";
import { inject } from "inversify";
import { APP } from "CONST";
import { interfaces } from "inversify-express-utils";
import { Application } from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";

@server()
export class ExpressServer {

  private app: Application;

  private config: ExternalDdnsConfig;

  constructor(
    @inject(APP.CONFIG)
    config: ExternalDdnsConfig,
    @inject(APP.APP_FACTORY)
    buildApp: (configure: interfaces.ConfigFunction)=>any
  ) {
    this.config = config;
    this.app = buildApp((app) => {
      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(bodyParser.json());
      app.use(helmet());
    });
  }

  public async start(): Promise<void> {
    const srv = this.getServer();
    const port = this.config.port;
    return new Promise((resolve) => {
      srv.listen(port, ()=> {
        console.log(`Server started on port ${port}`);
        resolve();
      });
    });
  }

  private getServer(): http.Server {
    const options: https.ServerOptions & http.ServerOptions = {};
    let srv: typeof http | typeof https;
    if (this.config.sslEnabled) {
      options.key = fs.readFileSync(this.config.sslKey);
      options.cert = fs.readFileSync(this.config.sslCert);
      srv = https;
    } else {
      srv = http;
    }
    return srv.createServer(options, this.app);
  }

}