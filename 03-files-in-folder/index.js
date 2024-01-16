const path = require('node:path');
const { readdir, stat } = require('fs/promises');

const srcFolderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const filesDirents = await readdir(srcFolderPath, { withFileTypes: true });
    const filesStats = await Promise.all(
      filesDirents.map((fileDirent) =>
        stat(path.join(fileDirent.path, fileDirent.name)),
      ),
    );

    filesDirents.forEach((fileDirent, index) => {
      if (fileDirent.isFile()) {
        const filePath = path.join(fileDirent.path, fileDirent.name);
        const fileExt = path.extname(filePath);
        const fileBasename = path.basename(filePath, fileExt);
        const fileSize = filesStats[index].size;
        const result = `${fileBasename} - ${fileExt.slice(
          1,
        )} - ${fileSize} byte`;
        console.log(result);
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
