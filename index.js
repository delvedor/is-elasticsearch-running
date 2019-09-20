'use strict'

const { Client } = require('@elastic/elasticsearch')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function es (opts = { node: 'http://localhost:9200' }) {
  const client = new Client(opts)

  return {
    isRunning,
    waitCluster
  }

  async function isRunning () {
    try {
      await client.ping()
      return true
    } catch (err) {
      return false
    }
  }

  async function waitCluster (waitForStatus = 'green', timeout = '50s', times = 0) {
    try {
      await client.cluster.health({ waitForStatus, timeout })
    } catch (err) {
      if (++times < 10) {
        await sleep(5000)
        return waitCluster(waitForStatus, timeout, times)
      }
      throw err
    }
  }
}

module.exports = es
