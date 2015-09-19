# Fidd.io
[![Build Status](https://travis-ci.org/fiddioteam/fiddio.svg?branch=dev)](https://travis-ci.org/fiddioteam/fiddio)
[![Dependency Status](https://david-dm.org/fiddioteam/fiddio.svg)](https://david-dm.org/fiddioteam/fiddio)
[![devDependency Status](https://david-dm.org/fiddioteam/fiddio/dev-status.svg)](https://david-dm.org/fiddioteam/fiddio#info=devDependencies)<br>
[![Ready](https://badge.waffle.io/fiddioteam/fiddio.png?label=ready&title=Ready)](https://waffle.io/fiddioteam/fiddio)
[![In Progress](https://badge.waffle.io/fiddioteam/fiddio.png?label=In Progress&title=In Progress)](https://waffle.io/fiddioteam/fiddio)
[![Under Review](https://badge.waffle.io/fiddioteam/fiddio.png?label=Under Review&title=Under Review)](https://waffle.io/fiddioteam/fiddio)

> __Ask. Watch. Learn. Code.___

## Team

- __Erik Eppel__: Product Owner
- __Femi Saliu__: Scrum Master
- __Thomas Greenhalgh, Kamron Batman__: Development Team

## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Contributing](#contributing)

## Usage

> On the front end, Fidd.io leverages the [Ace Editor](http://ace.c9.io/#nav=about) API for its in-browser code editors, specifically the [UI.Ace](http://angular-ui.github.io/ui-ace/) from AngularJS's UI Team. The factories responsible for configuring and coordinating the ace editor directive can be found in `client/app/editorServices`. 

## Requirements

### Backend
- [Node.js](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [Postgres](http://www.postgresql.org/)
- [Bookshelf.js](http://bookshelfjs.org/)

### Frontend
- [AngularJS](https://angularjs.org/)

### Utilities
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)
- [npm](https://www.npmjs.com/)

## Development

### Installing Dependencies

Fork your own copy of the project to your account and set the upstream to `github.com/fiddioteam/fiddio.git`.

[Install Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides). For Mac development, use [Postgres.app](http://postgresapp.com/).

With Postgres installed, set up the database with the following commands:
```
CREATE DATABASE fiddio;
CREATE USER root PASSWORD '';
ALTER USER root with SUPERUSER;
```

In the root of the project, add a file called `.env` with the following:
```
NODE_ENV    = 'development'

urlAbsolute     = 'fidd.io'
urlAbsoluteDev  = 'localhost:8000'

port            = 80
portDev         = 8000

dbClient        = 'postgres'
dbHost          = '127.0.0.1'
dbUser          = 'root'
dbPassword      = ''
dbDatabase      = 'fiddio'

ghApiIdDev      = ''
ghApiSecretDev  = ''

ghApiId         = ''
ghApiSecret     = ''

fbApiIdDev      = ''
fbApiSecretDev  = ''

fbApiId         = ''
fbApiSecret     = ''

mpApiId     = ''
mpApiSecret   = ''

sessionKey      = 'fiddio'
sessionSecret   = 'we like kitties!'
```

With [Grunt](http://gruntjs.com/), [Bower](http://bower.io/), and [npm](https://www.npmjs.com/#getting-started) installed globally, install dependencies by running the following commands from the terminal:
```
npm install
grunt
```

`grunt` installs front end dependencies and starts the server. To build the project without started the background server, run `grunt build` instead of `grunt`.

To stop the server from running the background in production mode, run `grunt stop`.

## Contributing

Fidd.io welcomes contributors. To begin contributing, please, see the [contributing guidelines](CONTRIBUTING.md).
