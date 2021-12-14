import * as fs from 'fs';
import path from 'path';
import exec from 'child_process';
import ContractParser from './ContractParser';
import deployContract from './deployContract';
import listEthAccount from './listEthAccount';
const solc = require('solc');

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
  const imports: any = [];
  solFiles.forEach((path: string) => {
    imports[path] = fs.readFileSync(path, 'utf8');
  });
  const findImports = (path: string) => {
    return {
      contents: imports['src/' + path]
    }
  }
  
  solFiles.forEach((solFile: string) => {
    const sourceCode = fs.readFileSync(solFile, 'utf8');

    const list = solFile.split('/');
    const fileName = list[list.length - 1].slice(0, -4);

    const input = {
      language: 'Solidity',
      sources: { main: { content: sourceCode } },
      settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
    }
    const output = solc.compile(JSON.stringify(input), { import: findImports });
    const contract = JSON.parse(output).contracts.main[fileName];

    (async () => {
      const list: string[] = await listEthAccount();
      const contractAddress: string = await deployContract(
        list[0],
        contract.evm.bytecode.object,
        JSON.stringify(contract.abi)
      );

      const baseFileName = pickOutFineName(solFile);
      const fineName: string = baseFileName + 'Contract.ts';
      const varName: string = baseFileName.charAt(0).toLowerCase() + baseFileName.slice(1) + 'Contract';
      const json: any = {
        address: contractAddress,
        abi: contract.abi,
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
        ABI: ${JSON.stringify(contract.abi)}
      `);
    })();
  })
})();
