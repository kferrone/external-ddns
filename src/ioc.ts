import { fluentProvide } from "inversify-binding-decorators";

export const service = (name: string)=> {
  return fluentProvide("Service")
    .inSingletonScope()
    .whenTargetNamed(name)
    .done();
}