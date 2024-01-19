const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dstPath = path.join(__dirname, 'answers.txt');

const writeStream = fs.createWriteStream(dstPath);

console.log('Hello! To exit use "exit" or ctrl+c');

function ask() {
  try {
    rl.question('What do you want to write down in the file? >> ', (answer) => {
      if (answer == 'exit') {
        rl.close();
      } else {
        writeStream.write(`${answer}${os.EOL}`);
        ask();
      }
    });
  } catch (err) {
    console.error(err);
  }
}

rl.on('close', function () {
  console.log(`${os.EOL}Your file is completed! Goodbye!`);
});

ask();
