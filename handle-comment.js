const fs = require('fs');

// Constants
const PERMITTED_AUTHOR = 'slingfox';
const COMMAND_PATCH = '!patch';
const COMMAND_MINOR = '!minor';
const COMMAND_MAJOR = '!major';
const FILE_PATH = 'openapi.json';


// Check that ist was a comment
if (process.env.GITHUB_EVENT_NAME !== 'issue_comment') {
  console.warn('Not an issue comment');
  return;
}

// Check that the user is permitted to execute via comment
if (process.env.GITHUB_ACTOR !== PERMITTED_AUTHOR) {
  console.warn('Not a comment by a permitted author');
  return;
}

// Read issue payload
const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));

console.log(payload);

// Parse the comment to find a bump command
const bumpAt = 2; // which part of the version triplet to bump
if (payload.comment.body.contains(COMMAND_PATCH)) {
  bumpAt = 2;
} else if (payload.comment.body.contains(COMMAND_MINOR)) {
  bumpAt = 1;
} else if (payload.comment.body.contains(COMMAND_MAJOR)) {
  bumpAt = 0;
} else {
  console.warn('No command found in: ' + payload.comment.body);
  return;
}

console.log('Bump: ' + bumpAt);

const data = fs.readFileSync(FILE_PATH);
const json = JSON.parse(data);

const oldVersionStr = json.info.version;

const oldVersion = oldVersionStr.match(/\d+/g);
console.log(oldVersion);


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