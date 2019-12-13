'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://bossapi.bzffs.cc"',
  MQTT_SERVICE: '"wss://dev-mqtt.threeape.com/wss"',
})
