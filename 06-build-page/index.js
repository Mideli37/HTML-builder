const {
  readFile,
  writeFile,
  readdir,
  rm,
  mkdir,
  copyFile,
} = require('node:fs/promises');
const path = require('node:path');
const fs = require('node:fs');

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
  const dstPath = path.join(__dirname, dstFolder);
  await createDir(dstPath);

  copyFolderFiles(srcFolder, dstFolder);
}

const srcStyleFolder = 'styles';
const dstStyle = path.join(__dirname, 'project-dist', 'style.css');

async function buildCSSBundle(srcFolder, dstPath) {
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
}

async function replaceTemplates() {
  let file = await readFile(path.join(__dirname, 'template.html'), 'utf8');
  const allComponents = await getFilesDirents('components');
  const components = allComponents.filter(
    (component) =>
      path.extname(path.join(__dirname, 'components', component.name)) ===
      '.html',
  );

  const componentContentsProm = components.map(async (component) => {
    const componentBasename = component.name.split('.')[0];
    const componentName = `{{${componentBasename}}}`;
    return [
      componentName,
      await readFile(
        path.join(__dirname, 'components', component.name),
        'utf8',
      ),
    ];
  });
  const componentContents = await Promise.all(componentContentsProm);

  componentContents.forEach((component) => {
    const [key, value] = component;
    file = file.replaceAll(key, value);
  });
  writeFile(path.join(__dirname, 'project-dist', 'index.html'), file);
}

async function buildPage() {
  const distPath = path.join(__dirname, 'project-dist');

  await createDir(distPath);
  await copyDir('assets', `project-dist${path.sep}assets`);
  await buildCSSBundle(srcStyleFolder, dstStyle);
  replaceTemplates();
}

buildPage();
