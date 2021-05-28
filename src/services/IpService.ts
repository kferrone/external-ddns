import * as publicIp from "public-ip";
import { injectable } from 'inversify';
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