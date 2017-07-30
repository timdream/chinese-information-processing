#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var fileName = 'hkscs-2004-big5-iso.txt';

var col2 = ['# HKSCS-2004 in ISO/IEC 10646-1:1993'];
var col3 = ['# HKSCS-2004 in ISO/IEC 10646-1:2000'];
var col4 = ['# HKSCS-2004 in ISO/IEC 10646:2003 with Amendment 1'];

fs.readFileSync(fileName, { encoding: 'ascii'}).split('\n').forEach((line, lineNum) => {
  if (lineNum < 2 || line.substr(0, 1) == '=') {
    return;
  }

  let [big5Bytes, col2Code, col3Code, col4Code] = line.split(/[ \t]+/);

  col2.push(big5Bytes + ' ' + col2Code);
  col3.push(big5Bytes + ' ' + col3Code);
  col4.push(big5Bytes + ' ' + col4Code);
});

fs.writeFileSync('hkscs2004-u11.txt', col2.join('\n'));
fs.writeFileSync('hkscs2004-u30.txt', col3.join('\n'));
fs.writeFileSync('hkscs2004-u41.txt', col4.join('\n'));
