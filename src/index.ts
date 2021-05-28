#!/usr/bin/env node

import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { TSConvict } from 'ts-convict';
import { ExternalDdnsConfig } from "config/Config";

// import all the provider bindings
import "controllers/MutatingWebhook";
import "services/IpService";

// load the container
let container = new Container();
container.load(buildProviderModule());

//load config
const config = new TSConvict<ExternalDdnsConfig>(ExternalDdnsConfig).load();

// build the express app
let server = new InversifyExpressServer(container);
server.setConfig((theApp) => {
  theApp.use(bodyParser.urlencoded({
    extended: true
  }));
  theApp.use(bodyParser.json());
  theApp.use(helmet());
});
let app = server.build();
app.listen(config.port);
console.log(`Server started on port ${config.port}`);

exports = module.exports = app;