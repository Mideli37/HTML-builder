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
    let files = await getFilesDirents(srcFolder);

    const writeStream = fs.createWriteStream(dstPath);

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const filePath = path.join(file.path, file.name);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (data) => {
          writeStream.write(data.toString());
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildCSSBundle(srcFolder, dstFilePath);
