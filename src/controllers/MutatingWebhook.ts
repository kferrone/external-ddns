import {
  controller, httpPost, requestBody
} from 'inversify-express-utils';
import { inject, named } from 'inversify';

const targetAnnotation = "external-dns.alpha.kubernetes.io/target";
const path = "/metadata/annotations/external-dns.alpha.kubernetes.io~1target"

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

    // initialize a minimal response
    const response: AdmissionResponse = {
      uid: addmissionReview.request.uid,
      allowed: true
    };

    // get the actual public ip
    const publicIP = await this.ipService.getIpV4();
    const metadata = addmissionReview.request.object.metadata;
    let op: PatchOperation = "add";
    let targetIP = null;

    // see if the target ip has already been set and grab it
    if (metadata.annotations.hasOwnProperty(targetAnnotation)) {
      targetIP = metadata.annotations[targetAnnotation];
      op = "replace";
    }

    // if these are different, then a patch is needed
    if (publicIP != targetIP) {
      response.patchType = "JSONPatch";
      response.patch = this.makePatch(op, publicIP);
      console.log(`The target ip will change from ${targetIP} to ${publicIP}`);
    }

    // now send back the review with the response
    addmissionReview.response = response;
    return addmissionReview;
  }

  private makePatch(op: PatchOperation, value: string): string {
    return Buffer.from(JSON.stringify([{ op, path, value }]), "base64").toString();
  }
}