# DevOps : tp-wik-dps-tp01

## I - Prérequis

Pour lancer le projet, vous devez créer une variable d'environnement **`PING_LISTEN_PORT`** qui contiendra le port que vous souhaitez que l'app écoute.

Il est également nécessaire d'avoir **`Node`** et **`Npm`** installés sur votre machine.

## II - Installation

Pour débuter l'installation, il est nécessaire de récupérer l'app sur **`Github`** avec cette commande: 

```
git clone https://github.com/GABLRM/2023-2024-DevOps.git
```

Une fois le git clone, rendez-vous dans le dossier **`TP01`** et installer les dépendances avec la commande suivante : 

```
npm init -y
```

## III - Lancement de l'app

Maintenant, il suffit de lancer l'application avec cette commande : 

```
npm start
```

Vous pouvez dorénavant vous rendre sur **`http://localhost:(Le port que vous avez indiqué dans votre variable d'environnement)/ping`**