import { fluentProvide } from "inversify-binding-decorators";
import { APP } from "CONST";

export const service = (name: string)=> {
  return fluentProvide(APP.SERVICE)
    .inSingletonScope()
    .whenTargetNamed(name)
    .done();
}

export const server = ()=> {
  return fluentProvide(APP.SERVER)
    .inSingletonScope()
    .done();
}