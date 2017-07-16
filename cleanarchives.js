#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var toiletdb = require('toiletdb')
var subtoilet = require('subtoilet')
var db = toiletdb(path.join(__dirname, '.db.json'))

db.open(function (err) {
  if (err) console.warn(err.message)
})

// setup
var archivesdb = subtoilet(db, 'archives')
var now = Date.now()

archivesdb.read(function (err, data) {
  if (err) console.warn(err.message)
  if (!data) return console.warn('no data')
  Object.keys(data).forEach(function (key) {
    var started = data[key].date
    var finished = data[key].finished

    if (finished && getDiff(finished) > 15) {
      rimraf(path.join(__dirname, '.tracks/', key), () => { })
    } else if (started && getDiff(started) > 30) {
      rimraf(path.join(__dirname, '.tracks/', key), () => { })
    } else {
      rimraf(path.join(__dirname, '.tracks/', key), () => { })
    }
  })
})

function getDiff (date) {
  var diff = Math.abs(new Date(now).getTime() - new Date(date).getTime())
  return Math.ceil(diff / (1000 * 60))
}
