
declare interface IpService {
  getIpV4(): Promise<string>;
  getIpV6(): Promise<string>;
}

declare interface JsonPatch {
  op: "add" | "replace" | "remove",
  path: string,
  value: string;
}

declare interface AdmissionReview<T = any> {
  apiVersion: "admission.k8s.io/v1beta1",
  kind: "AdmissionReview",
  request: AdmissionRequest<T>,
  response: AdmissionResponse
}

declare interface AdmissionResponse {
  uid: string,
  allowed: boolean,
  patchType?: "JSONPatch"
  patch?: string // base64 string from array of JsonPatch
  result?: string,
  auditAnnotations?: { [key: string]: string }
}

declare interface AdmissionRequest<T = any> {
  uid: string;
  kind: KindRef;
  resource: ResourceRef;
  subResource: string;
  requestKind: KindRef;
  requestResource: ResourceRef;
  requestSubResource: string;
  name: string;
  namespace: string;
  operation: "CREATE" | "UPDATE" | "DELETE" | "CONNECT";
  userInfo: UserInfo;
  object: T;
  oldObject: T;
  options: any;
  dryRun: boolean;
}
declare interface KindRef {
  group: string;
  version: string;
  kind: string;
}
declare interface ResourceRef {
  group: string;
  version: string;
  resource: string;
}
declare interface UserInfo {
  username: string;
  uid: string;
  groups?: (string)[] | null;
  extra: any;
}
