
const name: string = process.env.npm_package_name;

export const APP = {
  CONFIG: Symbol.for(`${name}/config`),
  SERVER: Symbol.for(`${name}/server`),
  SERVICE: Symbol.for(`${name}/service`),
  APP_FACTORY: Symbol.for(`${name}/app_factory`)
}