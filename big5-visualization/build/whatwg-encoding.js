'use strict';

// This script implements WHATWG Encoding Standard for Big5,
// and outputs the full decoding and encoding table.
//
// https://encoding.spec.whatwg.org/#legacy-multi-byte-chinese-(traditional)-encodings

var fs = require('fs');
var big5Index = (() => {
  let index = new Map();
  fs.readFileSync('index-big5.txt', { encoding: 'utf8'}).split('\n').forEach((line) => {
    if (!line || line.substr(0, 1) == '#') {
      return;
    }

    let [pointer, unicodeCodePoint] = line.trim().split(/[ \t]+/);
    pointer = parseInt(pointer, 10);
    unicodeCodePoint = parseInt(unicodeCodePoint, 16);

    if (index.get(pointer)) {
      throw new Error('Duplicate entry? ' + pointer);
    }
    index.set(pointer, unicodeCodePoint);
  });

  return index;
})();

function decode(bytes) {
  let bytesArr;
  if (bytes < 0x100) {
    bytesArr = [bytes];
  } else {
    bytesArr = [bytes >> 8, bytes & 0xff];
  }

  // Encode to two characters, not needed for the purpose of table generation.
  if (bytesArr[0] <= 0x7f && bytesArr.length > 1) {
    return;
  }

  let decoderLead = 0;
  let codePoints = [];

  for (let i = 0; i < bytesArr.length; i++) {
    let byte = bytesArr[i];

    // 3
    if (decoderLead != 0) {
      let lead = decoderLead;
      let pointer;
      let offset;
      decoderLead = 0;

      // 3.1
      if (byte <= 0x7f) {
        offset = 0x40;
      } else {
        offset = 0x62;
      }

      // 3.2
      if ((byte >= 0x40 && byte <= 0x7e) || (byte >= 0xa1 && byte <= 0xfe)) {
        pointer = (lead - 0x81) * 157 + (byte - offset);
      }

      // 3.3
      switch (pointer) {
        case 1133:
          codePoints.push(0x00ca);
          codePoints.push(0x0304);
          continue;
        case 1135:
          codePoints.push(0x00ca);
          codePoints.push(0x030c);
          continue;
        case 1164:
          codePoints.push(0x00ea);
          codePoints.push(0x0304);
          continue;
        case 1166:
          codePoints.push(0x00ea);
          codePoints.push(0x030c);
          continue;
      }

      // 3.4 & 3.5
      if (big5Index.get(pointer)) {
        codePoints.push(big5Index.get(pointer));
        continue;
      }

      // 3.6
      if (byte <= 0x7f) {
        codePoints.push(byte);
      }

      // 3.7 Error
      return;
    }

    // 4
    if (byte <= 0x7f) {
      codePoints.push(byte);
      continue;
    }

    // 5
    if (byte >= 0x81 && byte <= 0xfe) {
      decoderLead = byte;
      continue;
    }

    return;
  }

  // end-of-stream

  // 1
  if (decoderLead != 0) {
    // Error
    return;
  }

  // 2
  return codePoints;
}

function encode(codePoint, pointer) {
  // 2
  if (codePoint <= 0x7f) {
    return codePoint;
  }

  // 3, 4
  if (big5Index.get(pointer) !== codePoint) {
    throw new Error('Invalid pointer.');
  }

  // 5
  let lead = ((pointer / 157) | 0) + 0x81;

  // 6
  let trail = pointer % 157;

  // 7
  let offset;
  if (trail < 0x3f) {
    offset = 0x40;
  } else {
    offset = 0x62;
  }

  // 8
  return lead << 8 | ((trail + offset) & 0xff);
}

function getB2UTable() {
  let buf = new ArrayBuffer(4 * 0x10000);
  let view = new DataView(buf);

  for (let i = 0; i < 0x10000; i++) {
    let codePoints = decode(i);
    if (!codePoints) {
      continue;
    }
    if (codePoints[0] > 0xffff) {
      if (codePoints[1]) {
        throw new Error('Data size over capacity.');
      }
      let str = String.fromCodePoint(codePoints[0]);
      codePoints[0] = str.charCodeAt(0);
      codePoints[1] = str.charCodeAt(1);
    }

    view.setUint16(i << 2, codePoints[0]);
    view.setUint16((i << 2) + 2, codePoints[1]);
  }

  fs.writeFileSync('whatwg-b2u.bin', new Uint8Array(buf));
}

getB2UTable();

function getU2BTable() {
  let buf = new ArrayBuffer(4 * 0x10000);
  let view = new DataView(buf);

  // Iterate through all unicode points encoded, and call our encode() impl.

  [...Array(0x80).keys()]
    .forEach((i) => {
      view.setUint16(i << 2, encode(i));
    });

  big5Index.forEach((codePoint, pointer) => {
    let bytes = encode(codePoint, pointer);
    let codePoints = [codePoint];
    if (codePoint > 0xffff) {
      if (codePoints[1]) {
        throw new Error('Data size over capacity.');
      }
      let str = String.fromCodePoint(codePoints[0]);
      codePoints[0] = str.charCodeAt(0);
      codePoints[1] = str.charCodeAt(1);
    }

    view.setUint16(bytes << 2, codePoints[0]);
    view.setUint16((bytes << 2) + 2, codePoints[1]);
  });

  fs.writeFileSync('whatwg-u2b.bin', new Uint8Array(buf));
}

getU2BTable();
