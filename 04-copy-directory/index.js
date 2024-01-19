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

async function copyFolderFiles(srcFolder, dstFolder = srcFolder) {
  const folderFiles = await getFilesDirents(srcFolder);
  folderFiles.forEach(async (file) => {
    if (file.isDirectory()) {
      copyFolderFiles(
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
  try {
    const dstPath = path.join(__dirname, dstFolder);
    await createDir(dstPath);

    await copyFolderFiles(srcFolder, dstFolder);
  } catch (err) {
    console.error(err);
  }
}

copyDir('files', 'files-copy');
