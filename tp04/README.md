# DevOps : tp-wik-dps-tp04

## Création du pod pour déployer l'image du tp WIK-DPS-TP02

Dans un premier temps, vous devez créer un fichier **`.yaml`**, qui servira de fichier de configuration pour notre pod

Le fichier de configuration pour le pod : [pod.yaml](../tp04/pod.yaml)

```yml
apiVersion: v1
kind: Pod
metadata:
  name: my-api
spec:
  containers:
  - name: my-api
    image: registry.cluster.wik.cloud/public/echo
    ports:
    - containerPort: 8080
    env:
    - name: PING_LISTEN_PORT 
      value : "8080"
```

Maintenant, vous devez appliquer les ressources indiquées dans le fichier yaml pour le pod
Vous pouvez faire ceci avec la commande suivante : 

```sh
> kubectl apply -f pod.yaml
```

Vérifiez la création du pod avec la commande suivante : 

```sh
> kubectl get pods
NAME     READY   STATUS    RESTARTS   AGE
my-api   1/1     Running   0          85s
```

Pour finir, vous devez créer un tunnel entre votre pod et votre machine, vous pouvez faire ceci avec la commande suivante :

```sh
> kubectl port-forward pod/my-api 8080:8080
```

> Mon pod est rediriger du port 8080 au port 8080

## Remplacer le pod par un ReplicaSet

Tout d'abord vous pouvez supprimer le pod créé précèdemment avec la commande suivante :

```sh
> kubectl delete -f pod.yaml
```

Ensuite, créez un autre fichier **`.yaml`**, qui servira celui-ci de fichier de configuration pour notre ReplicaSet.

Le fichier de configuration pour le pod : [replicaset.yaml](../tp04/replicaset.yaml)

```sh
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-api-replica
  labels:
    app : my-api-replica
spec:
  replicas: 4
  selector:
    matchLabels:
      app: my-api-replica
  template:
    metadata:
      labels:
        app: my-api-replica
    spec:
      containers:
      - name: my-api-replica
        image: registry.cluster.wik.cloud/public/echo
        ports:
        - containerPort: 8080
        env:
        - name: PING_LISTEN_PORT 
          value : "8080"
```

Maintenant, comme pour le pod, vous devez appliquer les ressources indiquées dans votre fichier .yaml pour le replicaset. 
Avec la même commande que le pod :

```sh
> kubectl apply -f replicaset.yaml
replicaset.apps/my-api-replica created
```

Ensuite, nous pouvons vérifier si le replicaset a bien été créé avec la commande suivante :

```sh
> kubectl get rs

NAME             DESIRED   CURRENT   READY   AGE
my-api-replica   4         4         4       5s
```

> Nous pouvons donc voir que le replicaset a bien été créé et qu'il y a bien 4 replicas

Pour voir les replicas, il suffit de taper la commande suivante :

```sh
> kubectl get pods

NAME                   READY   STATUS    RESTARTS   AGE
my-api-replica-8b9hh   1/1     Running   0          10s
my-api-replica-8jvpn   1/1     Running   0          10s
my-api-replica-djghm   1/1     Running   0          10s
my-api-replica-qgzqh   1/1     Running   0          10s
```

> Nous pouvons donc voir que les pods créés par le replica existent bien

## Remplacer le ReplicaSet par un Deployment

Comme précèdemment, vous pouvez supprimer le ReplicaSet créé auparavant avec la commande suivante :

```sh
> kubectl delete -f replicaset.yaml
```

Ensuite, créez un autre fichier **`.yaml`**, qui servira celui-ci de fichier de configuration pour notre Deployment.

Le fichier de configuration pour le Deployment : [deployment.yaml](../tp04/deployment.yaml)

```sh
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api-deployment
  labels:
    app : my-api-deployment
spec:
  replicas: 4
  selector:
    matchLabels:
      app: my-api-deployment
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 50%
  template:
    metadata:
      labels:
        app: my-api-deployment
    spec:
      containers:
      - name: my-api-deployment
        image: registry.cluster.wik.cloud/public/echo
        ports:
        - containerPort: 8080
        env:
        - name: PING_LISTEN_PORT 
          value : "8080"
```

Maintenant, comme pour le pod et le replicaset, vous devez appliquer les ressources indiquées dans votre fichier .yaml pour le replicaset. 
Avec la même commande que le pod et le replicaset :

```sh
> kubectl apply -f deployment.yaml
deployment.apps/my-api-deployment created
```

Ensuite, nous pouvons vérifier si le deployment a bien été créé avec la commande suivante :

```sh
> kubectl get deployment 

NAME                READY   UP-TO-DATE   AVAILABLE   AGE
my-api-deployment   4/4     4            4           4s
```

> Nous pouvons donc voir que le deployment a bien été créé et qu'il y a bien 4 replicas

Pour voir les replicas, il suffit de taper la commande suivante :

```sh
> kubectl get pods

NAME                                 READY   STATUS    RESTARTS   AGE
my-api-deployment-7959c5b989-6nh82   1/1     Running   0          5m43s
my-api-deployment-7959c5b989-qdh7n   1/1     Running   0          5m43s
my-api-deployment-7959c5b989-qsmrm   1/1     Running   0          5m43s
my-api-deployment-7959c5b989-tn274   1/1     Running   0          5m43s
```

> Nous pouvons donc voir que les pods créés par le deployment existent bien

## Création d'un service

Ce service permet de communiquer avec les pods du Deployment

Vous devez créer un autre fichier **`.yaml`**, qui servira celui-ci de fichier de configuration pour notre Service.

Le fichier de configuration pour le Deployment : [service.yaml](../tp04/service.yaml)

```sh
apiVersion: v1
kind: Service
metadata:
  name: my-api-service
spec:
  selector:
    app: my-api-deployment
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

Vous devez maintenant lancer le Deployment et le service, comme ceci :

```sh
> kubectl apply -f deployment.yaml
deployment.apps/my-api-deployment created

> kubectl apply -f service.yaml
service/my-app-service created
```

Vous pouvez ensuite forwarder le service, avec la commande suivante : 

```sh
> kubectl port-forward service/my-app-service 8080:8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Handling connection for 8080
```

.