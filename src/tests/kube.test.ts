/**
 * @module test/models
 */
import { suite, test } from "@testdeck/mocha";
import "mocha";

/**
 * tests a model with a submodel but no Config annotation
 */
@suite("Run some testing on the k8s lib")
export class ReflectorTester {
    @test("Make sure we can load k8s properly")
    public loadK8s() {
        
    }
}