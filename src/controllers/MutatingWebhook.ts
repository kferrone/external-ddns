import {
  controller, httpPost, requestBody
} from 'inversify-express-utils';
import { inject, named } from 'inversify';
import { Request } from 'express';
import * as k8s from "@kubernetes/client-node";

const path = "/metadata/annotations/external-dns.alpha.kubernetes.io~1ddns"

@controller('/ddns')
export class MutatingWebhook {

  constructor(
    @inject("Service")
    @named("ip")
    private ipService: IpService
  ) { }

  @httpPost('/')
  public async newUser(@requestBody() addmissionReview: AdmissionReview): Promise<AdmissionReview> {
    console.log(addmissionReview);
    const ip = await this.ipService.getIpV4();
    const patch = this.makePatch("add", ip);
    return {
      kind: addmissionReview.kind,
      apiVersion: addmissionReview.apiVersion,
      request: addmissionReview.request,
      response: {
        uid: addmissionReview.request.uid,
        allowed: true,
        patchType: "JSONPatch",
        patch
      }
    }
  }

  private makePatch(op: "add" | "replace", value: string): string {
    return Buffer.from(JSON.stringify({ op, path, value }), "base64").toString();
  }
}