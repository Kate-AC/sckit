import axios from 'axios';
import Web3 from 'web3';

const createContract = async (from: string, binary: string, abi: string): Promise<string> => {
  const web3 = new Web3(process.env.REACT_APP_GETH_URL ?? 'http://eth:8545');
  const contractInstance = new web3.eth.Contract(JSON.parse(abi));

  return contractInstance
    .deploy({
      data: binary === '' ? '0x0' : binary
    })
    .send({
      from: from,
      gas: 3500000
    })
    .on('transactionHash', (transactionHash) => {
      // console.log('transaction_hash: ' + transactionHash);
    })
    .then(async (newContractInstance) => {
      return newContractInstance.options.address;
    });
};

const deployContract = async (from: string, binary: string, abi: string): Promise<string> => {
  const contractId: string = await createContract(from, binary, abi);

  return contractId;
}

export default deployContract;
