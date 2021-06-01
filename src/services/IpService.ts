import * as publicIp from "public-ip";
import { service } from "ioc";

@service("ip")
export class PublicIpService implements IpService {
  public async getIpV4(): Promise<string> {
    return await publicIp.v4();
  }
  public async getIpV6(): Promise<string> {
    return await publicIp.v6();
  }
  
}