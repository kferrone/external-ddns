/**
 * @module test/models
 */
import { suite, test } from "@testdeck/mocha";
import "mocha";
import * as k8s from "@kubernetes/client-node";

/**
 * tests a model with a submodel but no Config annotation
 */
@suite("Run some testing on the k8s lib")
export class K8sClientTester {
    @test("Get the default config")
    public async loadK8sDefaultConfig() {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        const client = k8s.KubernetesObjectApi.makeApiClient(kc);
        const ingresses = await client.read({kind: "Ingress"});
        console.log(ingresses);
    }
}