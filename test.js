'use strict'

const http = require('http')
const { URL } = require('url')
const stoppable = require('stoppable')
const { errors } = require('@elastic/elasticsearch')
const { test, teardown } = require('tap')
const esOk = require('./')()
const esNotOk = require('./')({ node: 'http://localhost:9201' })
var server = null

test('Start http server', t => {
  server = stoppable(http.createServer(handler))
  server.listen(9200, () => {
    t.end('Done')
  })
})

teardown(server.stop)

function handler (req, res) {
  if (req.method === 'HEAD') {
    return res.end()
  }

  const url = new URL(`http://localhost:9200${req.url}`)

  if (url.searchParams.get('wait_for_status') !== 'green') {
    res.statusCode = 500
  }
  res.end()
}

test('isRunning', t => {
  t.test('true', async t => {
    t.true(await esOk.isRunning())
  })

  t.test('false', async t => {
    t.false(await esNotOk.isRunning())
  })

  t.end()
})

test('waitCluster', t => {
  t.test('success', async t => {
    try {
      await esOk.waitCluster()
    } catch (err) {
      t.fail('Should not throw')
    }
  })

  t.test('failure', async t => {
    try {
      await esOk.waitCluster('purple', '', 8)
    } catch (err) {
      t.true(err instanceof errors.ResponseError)
    }
  })

  t.end()
})
