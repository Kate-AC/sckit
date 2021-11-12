import getEthBalance from './getEthBalance';
import getMyEthAccount from './getMyEthAccount';

const getMyEthBalance = async () => {
  const myAccount = await getMyEthAccount();
  return await getEthBalance(myAccount);
}

if (process.argv[1] === __filename) {
  (async() => {
    console.log('Inquiring...');
    console.log(await getMyEthBalance());
  })();
}

export default getMyEthBalance;