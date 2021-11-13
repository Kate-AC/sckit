import * as fs from 'fs';
import path from 'path';
import exec from 'child_process';
import ContractParser from './ContractParser';
import deployContract from './deployContract';
import listEthAccount from './listEthAccount';

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
    exec.exec('solc --bin --abi ' + solFile, (error, stdout) => {
      if (error !== null) {
        console.log(error);
        return;
      }
      const contractParser = new ContractParser(stdout);
      (async () => {
        const list: string[] = await listEthAccount();
        const contractAddress: string = await deployContract(
          list[0],
          contractParser.getBinary(),
          contractParser.getAbi()
        );

        console.log(`
          [ ${solFile} ]
          ContractId: ${contractAddress}

        `);
      })();
    });
  })
})();
