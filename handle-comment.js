const fs = require('fs');



console.log(process.env);
const FILE_PATH = 'openapi.json';

const data = fs.readFileSync(FILE_PATH);
const json = JSON.parse(data);

const oldVersionStr = json.info.version;

const oldVersion = oldVersionStr.match(/\d+/g);
console.log(oldVersion);

const bumpAt = 2;

// https://github.com/weflex/semver-increment/blob/master/index.js
let newVersion = []
for (let i = 0; i < oldVersion.length; ++i) {
    if (i < bumpAt) {
      newVersion[i] = +oldVersion[i];
    } else if (i === bumpAt) {
      newVersion[i] = +oldVersion[i] + 1;
    } else {
      newVersion[i] = 0;
    }
  }

const newVersionStr = newVersion.join('.');
console.log(newVersionStr);

json.info.version = newVersionStr;
fs.writeFileSync(FILE_PATH, JSON.stringify(json, null, 2));