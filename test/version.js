#!/usr/bin/nodejs
"use strict";
var Version = require('../index').Package.Version
var util = require('util')

var v1 = new Version('9.9.5.dfsg-8')
var v2 = new Version('1:9.9.5.dfsg-8')
console.log(util.inspect(v1, true, true, true))
console.log(util.inspect(v2, true, true, true))
console.log(v1.cmp(v2))
console.log(v1.cmp(v1))
console.log(v2.cmp(v1))
