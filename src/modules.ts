import { ContainerModule, interfaces } from "inversify";
import { TSConvict } from 'ts-convict';
import { ExternalDdnsConvict } from "Config";
import { InversifyExpressServer } from "inversify-express-utils";
import { buildProviderModule } from "inversify-binding-decorators";
import { APP } from "CONST";

// import all of the applications features
import "controllers/MutatingWebhook";
import "controllers/Health";
import "services/IpService";
import "services/CronService";
import "Server";

export const Providers = buildProviderModule();

export const Bindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ExternalDdnsConfig>(APP.CONFIG)
    .to(ExternalDdnsConvict)
    .inSingletonScope()
    .onActivation((_ctx: interfaces.Context) => 
      new TSConvict<ExternalDdnsConfig>(ExternalDdnsConvict).load());
    
  bind(APP.APP_FACTORY)
    .toFactory((ctx: interfaces.Context) => {
      return (configure: ()=>any)=> new InversifyExpressServer(ctx.container)
      .setConfig(configure)
      .build();
    })
});