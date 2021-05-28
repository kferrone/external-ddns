import { Property, Config } from 'ts-convict';
import { url, ipaddress } from 'convict-format-with-validator';
import * as yaml from 'js-yaml';

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

}