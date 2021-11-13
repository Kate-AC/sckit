import axios from 'axios';
import Web3 from 'web3';

/*
const sendBinary = (from: string, binary: string): Promise<any> => axios.post(
  'http://eth:8545',
  {
    'jsonrpc': '2.0',
    'method': 'eth_sendTransaction',
    'params': [
      {
        "from": from,
        "to": null,
        "gas": "0x24A22",
        "gasPrice": "0x0",
        "data": binary,
        "nonce": 0
      }
    ],
    'id': 1
  }
)
.then(response => {
  const { data } = response;
  return data.result;
})
.catch(error => {
  console.log(error);
  throw new Error(error);
});
*/

const createContract = async (from: string, binary: string, abi: string): Promise<string> => {
  const web3 = new Web3('http://eth:8545');
  const contractInstance = new web3.eth.Contract(JSON.parse(abi));

  return contractInstance
    .deploy({
      data: binary
    })
    .send({
      from: from,
      gas: 1500000
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
