#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var fileName = process.argv[2];

var buf = new ArrayBuffer(4 * 0x10000);
var view = new DataView(buf);

fs.readFileSync(fileName, { encoding: 'ascii'}).split('\n').forEach((line) => {
  if (!line || line.substr(0, 1) == '#') {
    return;
  }

  let [big5Bytes, unicodeCodePoint] =
    line.split(/[ \t]+/).map(str => parseInt(str, 16));

  if (isNaN(big5Bytes)) {
    return;
  }

  if (big5Bytes >= 0x0100 && big5Bytes < 0x2000) {
    throw new Error('Table contain mapping from/to invalid Big5 range. ' +
      '(' + big5Bytes.toString(16).toUpperCase() + ')');
  }

  if (isNaN(unicodeCodePoint)) {
    var matches = line.split(/[ \t]+/)[1].match(/\b[\da-fA-F]{4}\b/g);
    if (matches && matches.length == 2) {
      // Two characters
      if (matches[0] == 0xfffd && matches[1] == 0xffff) {
        throw new Error('Mapped Unicode sequences conflict with error value.');
      }
      view.setUint16(big5Bytes << 2, parseInt(matches[0], 16));
      view.setUint16((big5Bytes << 2) + 2, parseInt(matches[1], 16));
    } else {
      // Error
      view.setUint16(big5Bytes << 2, 0xfffd);
      view.setUint16((big5Bytes << 2) + 2, 0xffff);
    }
  } else if (unicodeCodePoint > 0xffff) {
    let str = String.fromCodePoint(unicodeCodePoint);
    view.setUint16(big5Bytes << 2, str.charCodeAt(0));
    view.setUint16((big5Bytes << 2) + 2, str.charCodeAt(1));
  } else {
    view.setUint16(big5Bytes << 2, unicodeCodePoint);
  }
});

fs.writeFileSync(path.basename(fileName, '.txt') + '.bin', new Uint8Array(buf));
