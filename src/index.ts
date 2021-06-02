#!/usr/bin/env node

import { Container } from "inversify";
import { Providers, Bindings } from "modules";
import { APP } from "CONST";

// make a container
const container = new Container({skipBaseClassChecks: true});

// load modules which bind all of the apps features
container.load(Providers);
container.load(Bindings);

// start the server
const server = container.get<Server>(APP.SERVER);
(async ()=> await server.start())()

