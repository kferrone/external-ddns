# External DDNS for k8s

Based on an annotation on a service or ingress, this will make sure the resource has the most up to date external IP address for external-dns to sync with. This extends the [external-dns](https://github.com/kubernetes-sigs/external-dns) project with one new annotation which will use a mutating webhook to update the ever changing public IP as a target for external-dns. 

When the following annotation is set
```yaml
external-dns.alpha.kubernetes.io/ddns: 'true'
```
The resource will get the following annotation injected with your public wan IP so external-dns can do it's magic.
```yaml
external-dns.alpha.kubernetes.io/target: <wan ip>
```

## Examples  

### Ingress  

```yaml
kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: myapp
  annotations:
    external-dns.alpha.kubernetes.io/ddns: 'true'
spec:
  ...
```

### Service  

```yaml
kind: Service
apiVersion: v1
metadata:
  name: myapp
  annotations:
    external-dns.alpha.kubernetes.io/ddns: 'true'
spec:
  ...
```

## References  
 - [external-dns](https://github.com/kubernetes-sigs/external-dns)
 - [Bitnami Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/external-dns)
 - [Writing a very basic kubernetes mutating admission webhook](https://medium.com/ovni/writing-a-very-basic-kubernetes-mutating-admission-webhook-398dbbcb63ec)
 - [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)