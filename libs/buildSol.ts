import * as fs from 'fs';
import path from 'path';
import exec from 'child_process';

const searchRecursive = async (filePath: string, foundFiles: string[] = []): Promise<string[]> => {
  const dirents: fs.Dirent[] = await fs.promises.readdir(filePath, {withFileTypes: true});
  const dirs: string[] = [];
  for (const dirent of dirents) {
    const currentFile = path.join(filePath, dirent.name);
    if (dirent.isDirectory()) {
      dirs.push(currentFile);
    } else {
      foundFiles.push(currentFile);
    }
  }
  for (const dir of dirs) {
    foundFiles = await searchRecursive(dir, foundFiles);
  }
 
  return Promise.resolve(foundFiles);
};

(async () => {
  const solFiles: string[] = await searchRecursive('src');

  solFiles.forEach((solFile: string) => {
    exec.exec('solc --bin --abi ' + solFile, (error, stdout, stderror) => {
      console.log(error);
      console.log(stdout);
      console.log(stderror);
    });
  })
})();
