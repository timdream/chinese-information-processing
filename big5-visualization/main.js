'use strict';

function toHex(num) {
  let str = num.toString(16).toUpperCase();
  while (str.length < 4) {
    str = '0' + str;
  }
  return str;
}

var tableEl = document.getElementById('table');
var headerEl = document.createElement('tr');

for (let i = -1; i < 16; i++) {
  let el = document.createElement('th');
  if (i >= 0) {
    el.textContent = i.toString(16).toUpperCase();
  }
  headerEl.appendChild(el);
}
tableEl.appendChild(headerEl);

for (let i = 0; i <= 0xffff; i += 0x10) {
  let rowEl = document.createElement('tr');
  let headerEl = document.createElement('th');
  headerEl.textContent = toHex(i).substr(0, 3) + 'x';
  rowEl.appendChild(headerEl);
  if (i >= 0x0100 && i < 0x2000) {
    rowEl.className = 'invalid-range';
  }
  if (i >= 0x2000 && i < 0x8000) {
    rowEl.className = 'invalid-range-uao';
  }
  rowEl.id = 'row-' + toHex(i);
  for (let j = 0; j <= 0xf; j++) {
    let el = document.createElement('td');
    rowEl.appendChild(el);
  }
  tableEl.appendChild(rowEl);
}

class EncodingTable {
  constructor(buf) {
    this.view = new DataView(buf);
  }

  get(bytes) {
    if (bytes > 0xffff) {
      throw new Error('Invalid range.');
    }
    let cp1 = this.view.getUint16(bytes << 2);
    let cp2 = this.view.getUint16((bytes << 2) + 2);

    if (!cp1) {
      return {};
    }

    let isError = false;
    let isBMP = true;
    let seq = '';
    let codePointsStr = '';
    let seqLength = 0;
    let codePoint = cp1;
    let alsoMappedBy;

    if (cp1 === 0xfffd && cp2 === 0xffff) {
      isError = true;
      seq = '\ufffd';
      seqLength = 1;
      codePointsStr = '(Error)';

      return { isError, isBMP, seq, codePointsStr, seqLength, codePoint, alsoMappedBy };
    }

    seq = String.fromCharCode(cp1) +
      (cp2 !== 0 ? String.fromCharCode(cp2) : '');
    if (!this.reverseMap) {
      this.setReverseMap();
    }
    alsoMappedBy = this.reverseMap.get(seq).filter(i => i != bytes);

    codePoint = seq.codePointAt(0);
    if (codePoint < 0xffff && cp2) {
      seqLength = 2;
      codePointsStr = 'U+' + toHex(cp1) + ' U+' + toHex(cp2);
    } else {
      isBMP = codePoint <= 0xffff;
      seqLength = 1;
      codePointsStr = 'U+' + toHex(codePoint);
    }

    return { isError, isBMP, seq, codePointsStr, seqLength, codePoint, alsoMappedBy };
  }

  decodeSeq(bytes) {
    if (bytes > 0xffff) {
      throw new Error('Invalid range.');
    }
    let cp1 = this.view.getUint16(bytes << 2);
    let cp2 = this.view.getUint16((bytes << 2) + 2);

    if (!cp1) {
      return;
    }

    if (cp1 === 0xfffd && cp2 === 0xffff) {
      return;
    }

    return String.fromCharCode(cp1) +
      (cp2 !== 0 ? String.fromCharCode(cp2) : '');
  }

  setReverseMap() {
    let map = this.reverseMap = new Map();
    for (let i = 0; i <= 0xffff; i++) {
      let seq = this.decodeSeq(i);
      if (!seq) {
        continue;
      }
      let arr;
      if (map.get(seq)) {
        arr = map.get(seq);
      } else {
        arr = [];
        map.set(seq, arr);
      }
      arr.push(i);
    }
  }

  getTotalUnicodeCount() {
    if (!this.reverseMap) {
      this.setReverseMap();
    }
    return this.reverseMap.size;
  }
}

async function updateTable() {
  let tableName = document.getElementById('tableName').value;
  if (!tableName) {
    return;
  }
  let compareTableName = document.getElementById('compareTableName').value;

  let bufP = fetch(tableName + '.bin').then(res => res.arrayBuffer());
  let compareBufP;
  if (compareTableName) {
    compareBufP = fetch(compareTableName + '.bin').then(res => res.arrayBuffer());
  }
  let [buf, compareBuf] = await Promise.all([bufP, compareBufP]);
  let table = new EncodingTable(buf);
  let compareTable;
  if (compareBuf) {
    compareTable = new EncodingTable(compareBuf);
  }

  let cellEls = tableEl.getElementsByTagName('td');

  let stat = {
    count: 0,
    pua: 0,
    'cjk-comp': 0,
    'non-bmp': 0,
    multi: 0,
    'unicode-count' : 0,
    composed: 0,
    error: 0,
    added: 0,
    removed: 0,
    conflict: 0
  };

  for (let i = 0; i <= 0xffff; i++) {
    let el = cellEls.item(i);
    let { isError, isBMP, seq, codePointsStr, seqLength, codePoint, alsoMappedBy } = table.get(i);
    let comparedSeq, comparedCodePointsStr;
    if (compareTable) {
      ({ seq: comparedSeq, codePointsStr: comparedCodePointsStr } = compareTable.get(i));
    }

    if (!seq) {
      el.className = 'blank';
      el.textContent = '';
      el.title = '0x' + toHex(i);
      if (compareTable && comparedSeq) {
        el.classList.add('removed');
        el.title += '\nRemoved from compared: ' + comparedCodePointsStr + ' ' + comparedSeq;
        stat.removed++;
      }
      continue;
    }

    let isPUA = false;
    let isCJKcomp = false;
    if (seqLength == 1) {
      isPUA = (codePoint >= 0xe000 && codePoint <= 0xF8FF) ||
        (codePoint >= 0xf0000 && codePoint <= 0xFFFFD) ||
        (codePoint >= 0x100000 && codePoint <= 0x10FFFD);
      isCJKcomp = (codePoint >= 0xf900 && codePoint <= 0xFAFF);
    }

    if (i > 0xff) {
      stat.count++;
    }

    el.className = '';
    el.textContent = seq;
    el.title = '0x' + toHex(i) + ' → ' + codePointsStr + ' ' + seq;

    if (compareTable) {
      if (!comparedSeq) {
        el.classList.add('added');
        el.title += '\nAdded from compared table';
        stat.added++;
      } else if (comparedSeq !== seq) {
        el.classList.add('conflict');
        el.title += '\nConflict from compared: ' + comparedCodePointsStr + ' ' + comparedSeq;
        stat.conflict++;
      }
    }

    if (isError) {
      el.classList.add('error');
      el.title += '\nError mapping; source contain mapping cannot be parsed.' +
        '\nLikely point to many Unicode code points at once.';
      stat.error++;
    }

    if (!isBMP) {
      el.classList.add('non-bmp');
      el.title += '\nnon-BMP code point';
      stat['non-bmp']++;
    }
    if (isCJKcomp) {
      el.classList.add('cjk-comp');
      el.title += '\nCJK Compatibility Ideographs';
      stat['cjk-comp']++;
    }
    if (isPUA) {
      el.classList.add('pua');
      el.title += '\nPrivate User Areas';
      stat.pua++;
    }
    if (seqLength > 1) {
      el.classList.add('composed');
      el.title += '\nComposed Unicode character';
      stat.composed++;
    }
    if (!isError && alsoMappedBy.length > 0) {
      el.title += '\nAlso map by: ' +
        alsoMappedBy.map(bytes => '0x' + toHex(bytes)).join(', ');
      el.classList.add('multi');
      stat.multi++;
    }
  }

  stat['unicode-count'] = table.getTotalUnicodeCount();

  for (let id in stat) {
    document.getElementById('stat-' + id).textContent = stat[id];
  }
  document.getElementById('stat-non-pua').textContent = stat.count - stat.pua;
}

updateTable();
