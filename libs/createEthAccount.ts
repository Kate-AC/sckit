import axios from 'axios';

console.log('Inquiring...');

axios.post(
  process.env.REACT_APP_GETH_URL ?? 'http://eth:8545',
  {
    'jsonrpc': '2.0',
    'method': 'personal_newAccount',
    'params': ['testpassword']
  }
)
.then(response => {
  console.log('Create success!');
})
.catch(error => {
  throw new Error(error);
});

