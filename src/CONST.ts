
const name: string = process.env.npm_package_name;

export const APP = {
  CONFIG: Symbol.for(`${name}/config`),
  SERVER: Symbol.for(`${name}/server`),
  SERVICE: Symbol.for(`${name}/service`),
  APP_FACTORY: Symbol.for(`${name}/app_factory`),
  KUBECONFIG: Symbol.for(`${name}/kubeconfig`),
  RESOURCE_PROVIDER: Symbol.for(`${name}/resource_provider`)
}

export const API_GROUPS = {
  Ingress: "networking.k8s.io/v1"
}