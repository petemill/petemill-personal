---
title: "Developing NodeJS services and module dependencies with Docker-Compose"
description: Running all node and npm operations exclusively through docker
created_utc: 2016/09/08 15:40:00
---

I wanted to experiment with using Docker for *all* Node and NPM commands, not just running Node apps. I'd seen this work for simple apps, but I wanted it to work not only for multiple-app services, but for ones that have locally-developed and `npm link`ed modules too. This worked well enough that I continued to use all Node and NPM commands through Docker for development.

I used the Docker for Mac app (which was beta at the time).

## Why
Some of the problems I wanted to solve:

 - Having to work on several Node projects at the same time, all having different Node version requirements and upgrade schedules.
 - Wanting the development environment to resemble the production environment as closely as possible.

In addition, in a multi-service architecture, I like to be able to allow myself and other team members to run simple commands to:
  - Get the entire suite of services up and running at once
  - Run individual services independently, on-demand
  - Run NPM commands against a service (or even a dependency)

...all whilst being confident that our environments are the same, and the commands that work for one person will work for everyone.

## Why not nvm or nodeenv?

These are both great tools to manage different versions of Node and NPM between a system and different projects. However, if we run our apps through Docker, that will result in not only a potentially different version of Node being used on your system compared to inside the app's Docker container, but also a different *platform*, i.e. MacOS vs Linux. **This can hurt when installing binary dependencies.**

## Structure

Our example app will have four 'projects': three services and one module. The module is shared by two of the services. Our goals are:
 - **Bind-mount the code.** This allows us to edit-and-restart code whilst the services are running, and prevents slow copy operations every app start.
 - **Bind-mount the shared dependencies.** That is, modules also developed locally should have their code shared in realtime with all the local services using their code. This allows us to quickly test changes in shared modules with all of our services.
 - **Use the same `package.json` in development and production.** This may go without saying but we should not have to modify the dependency tree in order to get the dev environment running. Otherwise we could have some maintenance issues.
 - **Keep each app's entrypoint the same in development and production.** We want to run the same stuff in dev as in live.

## Docker-Compose

I split the structure in to multiple docker-compose files:
 1. _docker-compose.yml:_ Descriptions for services that should be run as part of our system.
 2. _docker-compose.admin.yml:_ Additional descriptions for our dependencies as standalone services, as well as admin commands that can be run against all services.

## Tricks
Some specifics we will need to take care of in order to meet all our goals:
 - Use volumes for each service's *node_modules* directory. Also for the local dependency's *node_modules* directory. This will allow caching of NPM installs across container creations.
 - Mount the *local* modules in each service's container at a separate path, e.g. `/deps/module-one`. This is so we can `npm link` our dependency and not have node steal the sub-modules from this directory for one service over another.
 - Use Nodemon inside a development container image to monitor for changes to *both* the app code and any local modules' code.

## Setup

When developing NPM modules locally, the `npm link` command allows you to keep your `package.json` file as is, as well as your `require('shared-dependency')` statements, yet use code from a separate, local directory where you may edit and commit your changes.

In order to have the shared module links survive across container-creation, I hardcode them in the development docker-image used by the services. The only downside here is that when I add a new shared module to the system, I have to add a new entry in the image. But that's one of a few manual steps that need to be done, so I don't mind.

***NodeBase/Dockerfile:***
```Dockerfile
# use any node version you want
FROM node:6

# we will use nodemon to provide re-start on code modification
RUN npm install -g nodemon


#fake central dependency links, so that the links have a connecting central link across containers
# do this for each shared module
RUN mkdir -p /usr/local/lib/node_modules/shared-dependency && \
  ln -s /deps/shared-dependency /usr/local/lib/node_modules/shared-dependency
```


***docker-compose.yml:***
```yml
version: '2'


volumes:
    service-a_modules:

    service-b_modules:

    service-c_modules:

    shared-dependency_modules:


services:

  service-a:
    # an image that has the desired version of node, plus nodemon and some helper scripts
    build: NodeBase
    # our services may communicate with eachother
    links:
      - service-b
    # run the app, you may want to specify args or environment variables
    command: nodemon app.js
    working_dir: /app-service-a
    volumes:
      # bind mount the app code from a local path to a container path
      - ./service-a:/app-service-a
      # override the node_modules dir with docker-only but long-lived directory
      - service-a_modules:/app-service-a/node_modules
      # bind mount the dependency code from a local path to a container path (repeat for any other locally-developed dependencies)
      - ./shared-dependency:/deps/shared-dependency
      # as before with node_modules, for the module this time
      - shared-dependency_modules:/deps/shared-dependency/node_modules

  # ....
  # REPEAT FOR OTHER SERVICES
  # ...
```

***docker-compose.admin.yml:***
```yml
version: '2'

services:

  shared-dependency:
    # same node image as our apps
    build: NodeBase
    # our commands will run against the module
    working_dir: /deps/shared-dependency
    volumes:
      # we only need this module's code...
      - ./shared-dependency:/deps/shared-dependency
      # ...and it's docker-specific modules (shared with the apps in docker too)
      - shared-dependency_modules:/deps/shared-dependency/node_modules
```

## Example Commands

Without using the local version of node at all, we can get our entire set of services up. We can also run maintenance NPM commands against any one of our services or dependencies...

**`docker-compose run service-a npm link shared-dependency`**: Sets up the initial link. Must be run for each service to dependency group. Personally, I set up helper command aliases for this *(See the tip at the end)*.

**`docker-compose up`**: Runs all our services

**`docker-compose run service-a npm install --save zzz`**: Runs a normal npm-install command against one of our services, and saves the output in the `package.json` file, as normal.

**`docker-compose -f docker-compose.admin.yml run shared-dependency npm test`**: Runs tests for the shared module. Similarly `npm install --save yyy` could be run too.

## Final Tip

Everytime I run in to a command I'll need to run a few times, perhaps in slightly different ways, I'll create a shell alias or function. One example is that after killing all containers, I'll need to run the commands against all the service for recreating the dependency links, or for reinstalling all NPM modules after a Node version change.

Here's one function:

```bash
adminrun() {
  serviceName=$1;
  shift;
  docker-compose -f "/my-dev-location/docker-compose.yml" -f "/my-dev-location/docker-compose.admin.yml" run --rm $serviceName $*
}
```

This allows me to run easier-to-type commands like:

`adminrun service-a npm link shared-dependency`

You could then make aliases. For example one that groups *all* the dependency `npm link` commands.
