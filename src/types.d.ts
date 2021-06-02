
declare interface ServerConfig {
  port: string
}

declare interface SslConfig {
  sslEnabled: boolean,
  sslCert: string,
  sslKey: string,
  sslCA: string
}

declare interface CronConfig {
  cronSchedule: string
}

declare interface ExternalDdnsConfig extends ServerConfig, SslConfig, CronConfig {
  env: string
}

declare interface Server {
  start(): Promise<void> | void,
  stop(): Promise<void> | void
}

declare interface Applet {
  start(): void;
  stop(): void;
}

declare type PatchOperation = "add" | "replace" | "remove";

declare interface IpService {
  getIpV4(): Promise<string>;
  getIpV6(): Promise<string>;
}

declare interface JsonPatch {
  op: PatchOperation,
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
