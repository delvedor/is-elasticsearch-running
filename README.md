# is-elasticsearch-running

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![node-ci](https://github.com/delvedor/is-elasticsearch-running/workflows/Node%20CI/badge.svg)](https://github.com/delvedor/is-elasticsearch-running/actions)

A small utility to verify if an Elasticsearch cluster is up and running.  
It's useful to sue in your test files, without the need to use `sleep` or other hacks.

## Install
```
npm i is-elasticsearch-running --save-dev
```

## Usage

### build

`is-elasticsearch-running` needs to be initialized with the client configuration, defaults to `{ node: 'http://localhost:9200' }`.

```js
const Es = require('is-elasticsearch-running')
const es = Es({ node: 'http://localhost:9200' })
```

The builder return an object with two utilities, `isRunning` and `waitCluster`.

### isRunning

Checks if Elasticsearch is running in a given moment, returns a boolean.

```js
const Es = require('is-elasticsearch-running')
const es = Es()

es.isRunning()
  .then(bool => {
    if (bool) console.log('Elasticsearch is up and running')
    else console.log('Elasticsearch is not running')
  })
```

### waitCluster

This is very useful to use at the beginning of your test suite, it send a cluster health request and waits until Elasticsearch is ready.
By default it waits for status green and uses a timeout of 50 seconds, with 5 seconds of delay between retries. In total, tries to connect to Elasticsearch 10 times before giving up.

```js
const Es = require('is-elasticsearch-running')
const es = Es()

es.waitCluster()
  .then(() => console.log('ready'))
  .catch(() => console.log('not ready'))

es.waitCluster('yellow', '30s')
  .then(() => console.log('ready'))
  .catch(() => console.log('not ready'))
```

## License

[MIT](./LICENSE)
