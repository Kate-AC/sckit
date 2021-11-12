import axios from 'axios';

const listEthAddress = (): Promise<any> => axios.post(
  'http://eth:8545',
  {
    'jsonrpc': '2.0',
    'method': 'eth_accounts',
    'params': [],
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

if (process.argv[1] === __filename) {
  (async () => {
    console.log('Inquiring...');
  
    console.log(await listEthAddress());
  })();
}

export default listEthAddress;