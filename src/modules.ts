import { ContainerModule, interfaces, decorate, injectable } from "inversify";
import { TSConvict } from 'ts-convict';
import { ExternalDdnsConvict } from "Config";
import { InversifyExpressServer } from "inversify-express-utils";
import { buildProviderModule } from "inversify-binding-decorators";
import { APP, API_GROUPS } from "CONST";
import * as k8s from "@kubernetes/client-node";

// import all of the applications features
import "controllers/MutatingWebhook";
import "controllers/Health";
import "services/IpService";
import "services/CronService";
// import "services/KubeService";
import "Server";

export const Providers = buildProviderModule();

export const Bindings = new ContainerModule((bind: interfaces.Bind) => {

  decorate(injectable(),k8s.KubeConfig)
  bind(APP.CONFIG)
    .to(k8s.KubeConfig)
    .inSingletonScope()
    .whenTargetNamed("kube")
    .onActivation((ctx: interfaces.Context, kc: k8s.KubeConfig) => {
      const config = ctx.container.get<ExternalDdnsConfig>(APP.CONFIG);
      if (config.env === "development") {
        kc.loadFromDefault();
      } else {
        kc.loadFromCluster();
      }
      return kc;
    });

  bind(APP.RESOURCE_PROVIDER)
    .toProvider((ctx: interfaces.Context) => {
      const kc = ctx.container.getNamed<k8s.KubeConfig>(APP.CONFIG, "kube");
      const client = kc.makeApiClient(k8s.NetworkingV1Api);
      return async (ip: string)=> {
        const patch = {
          op: "replace",
          path: "/metadata/annotations/external-dns.alpha.kubernetes.io~1bubs",
          value: ip
        };
        const res = await client.listIngressForAllNamespaces(undefined,undefined,undefined,"external-ddns=true");
        return (res.body as any).items.filter((ingress: k8s.V1Ingress) => {
          return (ingress.metadata.annotations["external-dns.alpha.kubernetes.io/target"] !== ip)
        }).array.forEach(async (ingress: k8s.V1Ingress) => {
          await client.patchNamespacedIngress(ingress.metadata.name, ingress.metadata.namespace, patch);
          console.log(`Updated Ingress/${ingress.metadata.namespace}/${ingress.metadata.name}`);
        });
      };
    })
    .whenTargetNamed("Ingress");

  bind<ExternalDdnsConfig>(APP.CONFIG)
    .to(ExternalDdnsConvict)
    .inSingletonScope()
    .whenTargetIsDefault()
    .onActivation((_ctx: interfaces.Context) => 
      new TSConvict<ExternalDdnsConfig>(ExternalDdnsConvict).load()
    );
    
  bind(APP.APP_FACTORY)
    .toFactory((ctx: interfaces.Context) => {
      return (configure: ()=>any)=> 
        new InversifyExpressServer(ctx.container)
          .setConfig(configure)
          .build();
    });
});