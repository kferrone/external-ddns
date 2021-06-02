import * as k8s from "@kubernetes/client-node";
import { service } from "ioc";

@service("kube")
export class KubeService {

  private client: k8s.KubernetesObjectApi;

  constructor() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.client = k8s.KubernetesObjectApi.makeApiClient(kc);
  }

  public async get(obj: k8s.KubernetesObject) {
    return await this.client.read(obj);
  }
}