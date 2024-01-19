const path = require('node:path');
const fs = require('node:fs');

const filePath = path.join(__dirname, 'text.txt');

const fileReadStream = fs.createReadStream(filePath);
fileReadStream.on('data', (data) => {
  console.log(data.toString());
});

fileReadStream.on('error', (err) => {
  console.log(err);
});
