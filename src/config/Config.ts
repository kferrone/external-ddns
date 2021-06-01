import { Property, Config } from 'ts-convict';
import { url, ipaddress } from 'convict-format-with-validator';
import * as yaml from 'js-yaml';

const cwd = process.cwd();

@Config({
    file: 'config/config.yaml',
    parser: {
        extension: ['yaml'],
        parse: yaml.load
    },
    formats: {
        url,
        ipaddress
    },
    validationMethod: 'warn'
})
export class ExternalDdnsConfig {

  @Property({
    doc: "The port for the app to listen on",
    default: "3000",
    env: "SERVER_PORT"
  })
  public port: string;

  @Property({
    doc: "True to enable cert management when there are certs to use",
    default: true,
    env: "SSL_ENABLED"
  })
  public sslEnabled: boolean;

  @Property({
    doc: "The file location of the ssl certificate",
    default: `${cwd}/certs/tls.crt`,
    env: "SSL_CERT"
  })
  public sslCert: string;

  @Property({
    doc: "The file location of the ssl certificates private key",
    default: `${cwd}/certs/tls.key`,
    env: "SSL_KEY"
  })
  public sslKey: string;

  @Property({
    doc: "The SSL CA if this is a self signed cert",
    default: `${cwd}/certs/ca.crt`,
    env: "SSL_CA"
  })
  public sslCA: string;

  @Property({
    doc: "The schedule for when to check for IP changes",
    default: "* * * * *",
    env: "CRON_SCHEDULE"
  })
  public cronSchedule: string;

}