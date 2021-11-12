import axios from 'axios';

console.log('Inquiring...');

axios.post(
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
  console.log(data.result);
})
.catch(error => {
  console.log(error);
  throw new Error(error);
});
