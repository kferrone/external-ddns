#!/usr/bin/env node

import { Container } from "inversify";
import { Providers, Bindings } from "modules";
import { APP } from "CONST";

// make a container
const container = new Container();

// load modules which bind all of the imported features
container.load(Providers);
container.load(Bindings);

// start the cron job runner
const cron = container.getNamed<Applet>(APP.SERVICE, "cron");
cron.start();

// start the server to listen for hooks and health checks
const server = container.get<Server>(APP.SERVER);
(async ()=> await server.start())()