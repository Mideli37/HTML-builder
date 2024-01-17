const { readdir, rm, mkdir, copyFile } = require('node:fs/promises');
const path = require('node:path');

async function getFilesDirents(folder) {
  const dirents = await readdir(path.join(__dirname, folder), {
    withFileTypes: true,
  });
  return dirents;
}

async function createDir(filePath) {
  await rm(filePath, { recursive: true, force: true });
  await mkdir(filePath, { recursive: true });
}

async function getPathes(srcFolder, dstFolder = srcFolder) {
  const folderFiles = await getFilesDirents(srcFolder);
  folderFiles.forEach(async (file) => {
    if (file.isDirectory()) {
      getPathes(
        path.join(srcFolder, file.name),
        path.join(dstFolder, file.name),
      );
    } else {
      await mkdir(path.join(__dirname, dstFolder), {
        recursive: true,
      });
      copyFile(
        path.join(__dirname, srcFolder, file.name),
        path.join(__dirname, dstFolder, file.name),
      );
    }
  });
}

async function copyDir(srcFolder, dstFolder) {
  const dstPath = path.join(__dirname, dstFolder);
  await createDir(dstPath);

  getPathes(srcFolder, dstFolder);
}

copyDir('files', 'files-copy');
