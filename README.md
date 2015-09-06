# Fidd.io
[![Build Status](https://travis-ci.org/deathbears/fiddio.svg?branch=dev)](https://travis-ci.org/deathbears/fiddio)
[![Dependency Status](https://david-dm.org/deathbears/fiddio.svg)](https://david-dm.org/deathbears/fiddio)
[![devDependency Status](https://david-dm.org/deathbears/fiddio/dev-status.svg)](https://david-dm.org/deathbears/fiddio#info=devDependencies)<br>
[![Ready](https://badge.waffle.io/deathbears/fiddio.png?label=ready&title=Ready)](https://waffle.io/deathbears/fiddio)
[![In Progress](https://badge.waffle.io/deathbears/fiddio.png?label=In Progress&title=In Progress)](https://waffle.io/deathbears/fiddio)
[![Under Review](https://badge.waffle.io/deathbears/fiddio.png?label=Under Review&title=Under Review)](https://waffle.io/deathbears/fiddio)

> __Bringing audio and live-coding playback to your fiddles__

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
- [Bookself.js](http://bookshelfjs.org/)

### Frontend
- [AngularJS](https://angularjs.org/)

### Utilities
- [Grunt](http://gruntjs.com/)
- [Bower](http://bower.io/)
- [npm](https://www.npmjs.com/)

## Development

### Installing Dependencies

With [Grunt](http://gruntjs.com/), [Bower](http://bower.io/), and [npm](https://www.npmjs.com/#getting-started) installed globally, install dependencies by running the following commands from the terminal:
```
npm install
grunt
```

## Contributing

Fidd.io welcomes contributors. To begin contributing, please, see the [contributing guidelines](CONTRIBUTING.md).
