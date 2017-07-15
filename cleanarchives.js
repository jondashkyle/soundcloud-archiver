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
    var date = data[key].finished
    if (date) {
      var timeDiff = Math.abs(new Date(now).getTime() - new Date(date).getTime())
      var diff = Math.ceil(timeDiff / (1000 * 60))
      // delete if it’s old
      if (diff > 15) {
        try {
          rimraf.sync(path.join(__dirname, '.tracks/', key))
        } catch (err) {
          console.log('can not remove ' + key)
        }
      }
    }
  })
})
