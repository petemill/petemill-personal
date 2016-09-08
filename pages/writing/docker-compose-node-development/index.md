---
title: "Developing NodeJS services and dependencies with Docker-Compose"
description: Running all node and npm operations exclusively through docker
created_utc: 2016/09/10 15:00:00
draft: 1
---

I wanted to experiment with using Docker for *all* Node and NPM commands, not just running Node apps. This worked well enough that I continued to use all Node and NPM commands through Docker for development.

I used the Docker for Mac (beta at the time) app.

## Why
Some of the problems I wanted to solve:

 - Having to work on several Node projects at the same time, all having different Node version requirements and upgrade schedules.
 - Wanting the development environment to resemble the production environment as closely as possible.

In addition, in a multi-service architecture, I like to be able to allow myself and other team members to run simple commands to:
  - Get the entire suite of services up and running at once
  - Run individual services independently, on-demand
  - Run NPM commands against a service (or even a dependency)

All whilst being confident that our environments are the same, and the commands will work for everyone if they work for one person.

## Why not nvm or nodeenv?

These are both great tools to manage different versions of Node and NPM on a system and between different projects. However, if we run our apps through Docker, that will result in not only a potentially different version of Node being used on your system compared to inside the app's Docker container, but also a different *platform*, i.e. MacOS vs Linux. **This can hurt when installing binary dependencies.**

## Structure

Our example app will have four 'projects': three services and one module which has code shared by two of the services. Our goals are:
 - Bind-mount the code. This makes us to edit code whilst the services are running, and prevents slow copy operations every app start.
 - Bind-mount the shared dependencies. That is, modules also developed locally should have their code shared in realtime with all the local services using their code. This allows us to quickly test changes in shared modules with all of our services.
 - Use the same `package.json` in development and production. This may go without saying but we should not have to modify the dependency tree in order to get this running. Otherwise we could have some maintenance issues.
 - App entrypoint should be the same in development and production.

## Docker-Compose

I split the structure in to two docker-compose files:
 1. _docker-compose.xml_: Descriptions for services that should be run as part of our system.
 2. _docker-compose.admin.xml_: Additional descriptions for our dependencies as standalone services, as well as admin commands that can be run against all services.

## Tricks
Some specifics we will need to take care of in order to meet all our goals:
 - Use volumes for each service's *node_modules* directory. Also for the local dependency's *node_modules* directory. This will allow caching of NPM installs across container creations.
 - Mount the *local* modules in each service's container at a separate path, e.g. `/deps/module-one`. This is so we can `npm link` our dependency and not have node steal the sub-modules from this directory for one service over another.
 - Use Nodemon inside a development container image to monitor for changes to *both* the app code and any local modules' code.

### Setup


### Commands

**`docker-compose up`**: Runs all our services
