#!/usr/bin/env node

import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { Container, interfaces } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { TSConvict } from 'ts-convict';
import { ExternalDdnsConfig } from "config/Config";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import { APP } from "TYPES";

// import all the provider bindings
import "controllers/MutatingWebhook";
import "controllers/Health";
import "services/IpService";

// load the container
let container = new Container();
container.load(buildProviderModule());

//load config
const config = new TSConvict<ExternalDdnsConfig>(ExternalDdnsConfig).load();
container.bind(APP.CONFIG)
  .to(ExternalDdnsConfig)
  .inSingletonScope()
  .onActivation((_ctx: interfaces.Context) => {
    console.log("Made a config");
    return new TSConvict<ExternalDdnsConfig>(ExternalDdnsConfig).load();
});

console.log(container.get(APP.CONFIG));

// build the express app
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(helmet());
});

const srvOptions: https.ServerOptions = {};
const app = server.build();
let srv: any = app;
if (config.sslEnabled) {
  srvOptions.key = fs.readFileSync(config.sslKey);
  srvOptions.cert = fs.readFileSync(config.sslCert);
  // if (fs.existsSync(config.sslCA)) srvOptions.ca = fs.readFileSync(config.sslCA);
  srv = https.createServer(srvOptions, app);
}

srv.listen(config.port, ()=> {
  console.log(`Server started on port ${config.port}`);
});
