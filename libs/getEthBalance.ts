import axios from 'axios';

const getEthBalance = (address: string): Promise<number> => axios.post(
  'http://eth:8545',
  {
    'jsonrpc': '2.0',
    'method': 'eth_getBalance',
    'params': [address, 'latest'],
    'id': 1
  }
)
.then(response => {
  const { data } = response;

  return parseInt(data.result, 16) / 1000000000000000000;
})
.catch(error => {
  throw new Error(error);
});

if (process.argv[1] === __filename) {
  const address: string | undefined = process.argv[2];

  if (address === undefined) {
    throw new Error('アドレスの指定がありません。');
  }
  
  (async() => {
    console.log('Inquiring...');
    console.log(await getEthBalance(address) + ' eth');
  })();
}

export default getEthBalance;