import axios from 'axios';

const unlockAccount = (address: string): Promise<void> => axios.post(
  'http://eth:8545',
  {
    'jsonrpc': '2.0',
    'method': 'personal_unlockAccount',
    'params': [address, null, 100],
    'id': 1
  }
)
.then(response => {
  console.log(response.data);
  console.log('Unlocked!');
})
.catch(error => {
  throw new Error(error);
});

if (process.argv[1] === __filename) {
  const address: string | undefined = process.argv[2];

  if (address === undefined) {
    throw new Error('アドレスの指定がありません。');
  }

  (async () => {
    console.log('Inquiring...');
  
    console.log(await unlockAccount(address));
  })();
}

export default unlockAccount;