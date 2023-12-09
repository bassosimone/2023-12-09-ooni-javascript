"use strict"

const _golang = require("_golang")

exports.now = function () {
    return _golang.timeNow()
}