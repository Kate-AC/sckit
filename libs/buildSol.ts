import * as fs from 'fs';
import path from 'path';
import deployContract from './deployContract';
import listEthAccount from './listEthAccount';
const solc = require('solc');
const linker = require('solc/linker');

type SolType = {
  name: string;
  path: string;
  importPath: string;
  source: string;
}

type DeployedType = {
  [key: string]: {
    name: string;
    address: string;
    importPath: string;
    abi?: any;
    binary?: string;
  }[];
};

let targetFilePaths: string[] = [];
let solFilePaths: string[] = [];
let libraryPaths: string[] = [];

let targetFiles: SolType[] = [];
let solFiles: SolType[] = [];
let libraries: SolType[] = [];

const searchRecursive = async (filePath: string, foundFiles: string[] = [], excludeDirs: string[] = []): Promise<string[]> => {
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
    if (!excludeDirs.find((item: string) => item === dir)) {
      foundFiles = await searchRecursive(dir, foundFiles);
    }
  }
 
  return Promise.resolve(foundFiles);
};

const resolveFiles = async (): Promise<void> => {
  targetFilePaths = await searchRecursive('src', [], ['src/libs']);
  solFilePaths = [...await searchRecursive('node_modules/@openzeppelin'), ...targetFilePaths];
  libraryPaths = await searchRecursive('src/libs');
}

const findImports = (path: string): { contents: string } => {
  let result: any = [...solFiles, ...libraries].find(item => item.importPath === path);

  if (result === undefined) {
    result = [...solFiles, ...libraries].find(item => 0 <= item.importPath.indexOf(path));

    if (result === undefined) {
      throw Error('The import path is undefined.');
    }
  }

  return { contents: result.source };
}

const pickOutFineName = (path: string) => {
  return path.substr(0, path.indexOf('.'))
}

const findTargetFiles = async (): Promise<SolType[]> => {
  const results: SolType[] = [];

  targetFilePaths.forEach((path: string) => {
    if (0 > path.indexOf('.sol')) {
      return;
    }

    const importPath = path.replace('src/', '');
    const list = path.split('/');
    const fileName = list[list.length - 1].slice(0, -4);

    results.push({
      name: fileName,
      path: path,
      importPath: importPath,
      source: fs.readFileSync(path, 'utf8')
    });
  });

  return Promise.resolve(results);
}

const findSolFiles = async (): Promise<SolType[]> => {
  const results: SolType[] = [];

  solFilePaths.forEach((path: string) => {
    if (0 > path.indexOf('.sol')) {
      return;
    }

    const importPath = path.replace('src/', '').replace('node_modules/', '');
    const list = path.split('/');
    const fileName = list[list.length - 1].slice(0, -4);

    results.push({
      name: fileName,
      path: path,
      importPath: importPath,
      source: fs.readFileSync(path, 'utf8')
    });
  });

  return Promise.resolve(results);
}

const findLibraries = async (): Promise<SolType[]> => {
  const results: SolType[] = [];

  libraryPaths.forEach((path: string) => {
    if (0 > path.indexOf('.sol')) {
      return;
    }

    const importPath = path.replace('src/', '');
    const list = path.split('/');
    const fileName = list[list.length - 1].slice(0, -4);

    results.push({
      name: fileName,
      path: path,
      importPath: importPath,
      source: fs.readFileSync(path, 'utf8')
    });
  });

  return Promise.resolve(results);
}

const deployLibraries = async (libraries: SolType[]): Promise<DeployedType> => {
  const list: string[] = await listEthAccount();
  const results: DeployedType = {};

  await Promise.all(libraries.map(async (solFile: SolType) => {
    const input = {
      language: 'Solidity',
      sources: { main: { content: solFile.source } },
      settings: { outputSelection: { '*': { '*': [ 'abi', 'evm.bytecode' ] } } }
    };

    const output = solc.compile(JSON.stringify(input), {
      import: findImports
    });

    const funcs = JSON.parse(output).contracts.main;

    await Promise.all(Object.entries(funcs).map(async (func: any) => {
      const funcName = func[0];
      const binary = func[1].evm.bytecode.object;

      const libraryAddress: string = await deployContract(
        list[0],
        binary,
        JSON.stringify([])
      );

      if (results[solFile.name] === undefined) {
        results[solFile.name] = [];
      }

      results[solFile.name].push({
        name: funcName,
        importPath: solFile.importPath,
        address: libraryAddress.toLowerCase()
      });
    }));
  }));

  return Promise.resolve(results);
}

const deployContracts = async (targetFiles: SolType[], deployedLibraries: DeployedType): Promise<DeployedType> => {
  const list: string[] = await listEthAccount();
  const results: DeployedType = {};

  await Promise.all(targetFiles.map(async (solFile: SolType) => {
    const input = {
      language: 'Solidity',
      sources: { main: { content: solFile.source } },
      settings: {
        outputSelection: { '*': { '*': [ 'abi', 'evm.bytecode' ] } }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), {
      import: findImports
    }));

    if (output.errors !== undefined && output.errors.length > 0) {
      throw Error('\x1b[31m' + JSON.stringify(output.errors));
    }

    const contracts = output.contracts;
    if (contracts === undefined) {
      // 型定義ファイル等
      return;
    }
    const funcs = contracts.main;

    await Promise.all(Object.entries(funcs).map(async (func: any) => {
      const funcName = func[0];
      const abi      = func[1].abi;
      let binary     = func[1].evm.bytecode.object;

      const libs: { [key: string]: string } = {};
      await Promise.all(Object.entries(deployedLibraries).map(async (deployedLibrary: any) => {
        const list = deployedLibrary[1];
        await Promise.all(list.map(async (item: any) => {
          const libName = item.importPath + ':' + item.name;
          libs[libName] = item.address;
        }));
      }));
      binary = linker.linkBytecode(binary, libs);

      const contractAddress: string = await deployContract(
        list[0],
        binary,
        JSON.stringify(abi)
      );

      if (results[solFile.name] === undefined) {
        results[solFile.name] = [];
      }

      results[solFile.name].push({
        name: funcName,
        address: contractAddress,
        importPath: solFile.importPath,
        abi: abi,
        binary: binary
      });
    }));
  }));

  return Promise.resolve(results);
}

(async () => {
  await resolveFiles();
  targetFiles = await findTargetFiles();
  solFiles    = await findSolFiles();
  libraries   = await findLibraries();

  const deployedLibraries = await deployLibraries(libraries);
  const deployedSolFiles = await deployContracts(targetFiles, deployedLibraries);

  Object.entries(deployedSolFiles).forEach((deployedSolFile: any) => {
    deployedSolFile[1].forEach((item: any) => {
      const name = item.name + 'Contract';
      const fileName: string = pickOutFineName(item.importPath) + 'Contract.ts';
      const json: any = {
        address: item.address,
        abi: item.abi,
        binary: item.binary,
      }
  
      fs.writeFileSync(
        `./built/${fileName}`,
        `import { ContractJsonType } from '../libs/contractJsonType';
  
  const ${name}: ContractJsonType = ${JSON.stringify(json, null, 2)}
  
  export default ${name};
        `
      );
  
      console.log(`[ ${fileName} ]
  ContractId: ${item.address}`);
      })
    });
})();
