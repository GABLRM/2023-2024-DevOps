# DevOps : tp-wik-dps-tp03

## Création du Docker-compose basé sur le Dockerile créé dans le TP02

Dans un premier temps, vous devez récupérer le **`Dockerfile`** du TP01, personnellement j'ai sélectionné le **[Dockerfile.onestage](../tp01/Dockerfile.onestage)**.

Dans le fichier **[Docker-compose.yml](../tp01/docker-compose.yml)** :

```
version: '3.8'

services:
  my_api:
    build:
      context: .
      dockerfile: Dockerfile.onestage

    expose:
      - '8080'

    deploy:
      replicas: 4

    environment:
      - PING_LISTEN_PORT=8080

    restart: always

  proxy:
    image: nginx:latest

    volumes:
      - ./proxy.conf:/etc/nginx/conf.d/proxy.conf

    ports:
      - 8081:8080

    depends_on:
      - my_api
```

## Création du fichier de conf pour le reverse proxy Nginx

Il faut créer un fichier de configuration pour le reverse Proxy Nginx

Dans le fichier [proxy.conf](../tp01/proxy.conf) :

```
server {
    # Port d'écoute de NGINX
    listen 8080;

    location / {
        # On définit des headers HTTP pour que le proxying se passe bien
        proxy_set_header  Host $host;
        proxy_set_header  X-Real-IP $remote_addr;
        proxy_set_header  X-Forwarded-Proto https;
        proxy_set_header  X-Forwarded-Host $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;

        # On définit la cible du proxying
        proxy_pass http://my_api:8080;
    }
}
```

## Lancement de l'application

Vous pouvez désormer démarrer votre application, avec la commande suivante : 

```
docker compose up --build
```
