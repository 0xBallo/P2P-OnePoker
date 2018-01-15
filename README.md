# P2P OnePoker browser game

> OnePoker browser P2P Game

## Required global npm packages for development

### vue-cli

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 3+ and [Git](https://git-scm.com/).

``` bash
npm install -g vue-cli
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Game Rules

### Goal

Reach **502** points for first. In case, two or more player reach 502 in the same turn, win the one with the highest score at the end of the turn. If at the flop you find a poker on the table, you instantly won the game.

### Scores

- **Royal Flush**: 100
- **Straight Flush**: 90
- **Four of a Kind**: 80
- **Full House**: 50
- **Flush**: 20
- **Straight**: 10
- **Three of a Kind**: 7
- **Two Pairs**: 3
- **One Pair**: 1
