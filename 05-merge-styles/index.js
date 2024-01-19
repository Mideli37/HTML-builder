const { readdir } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const srcFolder = 'styles';
const dstFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function getFilesDirents(folder) {
  const dirents = await readdir(path.join(__dirname, folder), {
    withFileTypes: true,
  });
  return dirents;
}

async function buildCSSBundle(srcFolder, dstPath) {
  try {
    const files = await getFilesDirents(srcFolder);

    const writeStream = fs.createWriteStream(dstPath);

    writeStream.on('error', (err) => {
      console.error(err);
    });

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const fileExt = path.extname(file.name);
      if (fileExt === '.css') {
        const filePath = path.join(file.path, file.name);
        const readStream = fs.createReadStream(filePath);

        await new Promise((resolve, reject) => {
          readStream.pipe(writeStream, { end: false });
          readStream.on('end', resolve);
          readStream.on('error', reject);
        });
      }
    }
    writeStream.emit('end');
  } catch (err) {
    console.error(err);
  }
}

buildCSSBundle(srcFolder, dstFilePath);
