import axios from 'axios';

const deployContract = (from: string, binary: string, abi: string): Promise<any> => axios.post(
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
        "data": binary
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

/*
  const web3 = new Web3('ws:eth:8545');
  const gasEstimate = web3.eth.estimateGas({data: binary});
  web3.eth.personal.unlockAccount(web3.eth.accounts[0], '', 300);

  const contract = new web3.eth.Contract(JSON.parse(abi));
  

  contract({from: web3.eth.accounts[0], data:bytecode, gas:gasEstimate });
  */
/*
if (process.argv[1] === __filename) {
  (async () => {
    console.log('Inquiring...');

    const binary: string | undefined = process.argv[2];
    const abi: string | undefined =  process.argv[3];

    if (binary === undefined) {
      throw new Error('バイナリが指定されていません。');
    }

    if (abi === undefined) {
      throw new Error('ABIが指定されていません。');
    }

    console.log(await deployContract(binary, abi));
  })();
}
*/

export default deployContract;
