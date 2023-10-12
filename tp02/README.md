# DevOps : tp-wik-dps-tp02

## Première image Docker - un seul stage : 

Vous devez créer un **`DockerFile`** dans le même dossier que l'api développé précèdemment, comme celui-ci :

Le fichier du [Dockerfile avec un seul stage](../tp01/Dockerfile.onestage)

```Dockerfile
# Utilisation d'une image de base Node.js avec TypeScript
FROM node:20

# Création d'un utilisateur non privilégié pour exécuter l'API
RUN useradd -m appuser
USER appuser

# Création d'un répertoire pour le code de l'API
WORKDIR /app

# Copie les fichiers du projet dans le conteneur
COPY --chown=appuser:appuser . .

# Installation des dépendances de l'API (y compris les dépendances TypeScript)
RUN npm install
 
# Exposition du port sur lequel l'API écoute
EXPOSE 8080

# Commande pour démarrer l'API (en utilisant le code compilé)
CMD npm start 
```

Vous devez ensuite, build votre image, avec la commande suivante tout en restant dans le même dossier que votre Dockerfile : 

```sh
docker build -t containerapi -f Dockerfile.onestage .
```
L'image est donc build avec comme nom **`containerapi`**

Désormé, vous n'avez plus cas lancer votre container avec cette commande : 

```sh
docker run -it -p 8080:8080 containerapi:latest
```

Le container est donc lancé sur **`le port 8080`**

## Deuxième image Docker - Plusieurs stage : 

Vous devez créer un **`autre DockerFile`** ou modifier celui créé dernièrement, dans le même dossier que l'api développé précèdemment, comme ceci :

Le fichier du [Dockerfile avec plusieurs stages](../tp01/Dockerfile.multistages)

```Dockerfile
# Étape 1 : Build de l'application
FROM node:20 AS builder

# Création d'un répertoire de travail
WORKDIR /app

# Copie les fichiers de l'API dans le conteneur
COPY --chown=appuser:appuser . .

# Installation les dépendances de l'API
RUN npm install

# Compilation de l'application
RUN npm run build

# Étape 2 : Exécution de l'application
FROM node:20

# Création d'un utilisateur non privilégié pour l'exécution de l'API
RUN useradd -m appuser
USER appuser

# Copie uniquement les fichiers de l'application compilée depuis l'étape précédente
COPY --chown=appuser:appuser --from=builder /app /app

# Exposition du port sur lequel l'API écoute
EXPOSE 8080

# Commande pour démarrer l'API
CMD npm start
```

vous devez ensuite répéter les même commandes que pour la première image, c'est-à-dire, que vous devez build votre image : 

```sh
docker build -t containerapimultistage -f Dockerfile.multistages .
```

et ensuite lancez le container : 

```sh
docker run -it -p 8080:8080 containerapimultistage:latest
```

## **`ATTENTION DE NE PAS LANCER LES DEUX CONTAINERS SIMULTANÉMENT SUR LE MÊME PORT !`**