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

const pickOutFineName = (path: string) => {
  const splitted = path.split('/');
  const last = splitted.slice(-1)[0];
  return last.substr(0, last.indexOf('.'))
}

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

        const baseFileName = pickOutFineName(solFile);
        const fineName: string = baseFileName + 'Contract.ts';
        const varName: string = baseFileName.charAt(0).toLowerCase() + baseFileName.slice(1) + 'Contract';
        const json: any = {
          address: contractAddress,
          abi: JSON.parse(contractParser.getAbi()),
        }

        fs.writeFileSync(
          `./built/${fineName}`,
          `import { ContractJsonType } from '../libs/contractJsonType';

const ${varName}: ContractJsonType = ${JSON.stringify(json, null, 2)}

export default ${varName};
          `
        );
  
        console.log(`
          [ ${solFile} ]
          ContractId: ${contractAddress}
          ABI: ${contractParser.getAbi()}

        `);
      })();
    });
  })
})();
