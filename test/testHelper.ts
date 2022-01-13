import Web3 from 'web3';
import deployContract from '../libs/deployContract';
import listEthAccount from '../libs/listEthAccount';

const useContract = async (contract: any) => {
    const web3 = new Web3(process.env.REACT_APP_GETH_URL ?? 'http://eth:8545');
    const list: string[] = await listEthAccount();
  
    const contractAddress: string = await deployContract(
        list[0],
        contract.binary,
        JSON.stringify(contract.abi)
      );

    return new web3.eth.Contract(
      contract.abi,
      contractAddress
    );
}

const assertEquals = (left: any, right: any, title: string) => {
  if (left == right) {
    console.log('\x1b[32m【' + title + '】' + left + ' ' + right);
  } else {
    console.log('\x1b[31m【' + title + '】' + left + ' ' + right);
  }
}

const assertContains = (left: any, right: string, title: string) => {
  if (-1 < String(left).indexOf(right)) {
    console.log('\x1b[32m【' + title + '】' + right);
  } else {
    console.log('\x1b[31m【' + title + '】' + left + ' ' + right);
  }
}

export {
  assertEquals,
  assertContains,
  useContract
}