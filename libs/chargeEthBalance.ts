import axios from 'axios';
import getMyEthAccount from './getMyEthAccount';

const amount: number | undefined = parseInt(process.argv[2] as string);
 
if (amount === undefined) {
  throw new Error('金額の指定がありません。');
}

console.log('Inquiring...');

const getCoinbaseAddress = () => {
  return axios.post(
    'http://eth:8545',
    {
      'jsonrpc': '2.0',
      'method': 'eth_coinbase',
      'params': [],
      'id': 1
    }
  )
  .then(response => {
    const { data } = response;
    return data.result;
  })
  .catch(error => {
    throw new Error(error);
  });  
}

const unlockCoinbaseAddress = (coinbaseAddress: string) => {
  return axios.post(
    'http://eth:8545',
    {
      'jsonrpc': '2.0',
      'method': 'personal_unlockAccount',
      'params': [coinbaseAddress],
      'id': 1
    }
  )
  .then(response => {
    console.log('Unlocked!');
  })
  .catch(error => {
    throw new Error(error);
  });  
}

const charge = (from: string, to: string, hexAmount: string) => {
  return axios.post(
    'http://eth:8545',
    {
      'jsonrpc': '2.0',
      'method': 'eth_sendTransaction',
      'params': [
        {
          'from': from,
          'to': to,
          "value": hexAmount
        }
      ],
      'id': 1
    }
  )
  .then(response => {
    console.log('Charged!');
  })
  .catch(error => {
    throw new Error(error);
  });  
}

(async () => {
  const hexAmount: string = '0x' + (amount * 1000000000000000000).toString(16),
    myAddress = await getMyEthAccount(),
    coinbaseAddress = await getCoinbaseAddress();
  console.log('coinbase_address: ' + coinbaseAddress);
  await unlockCoinbaseAddress(coinbaseAddress);
  charge(coinbaseAddress, myAddress, hexAmount);
})();