import listEthAccount from './listEthAccount';

const getMyEthAccount = async () => {
  const list = await listEthAccount();
  return list[1];
}

if (process.argv[1] === __filename) {
  (async() => {
    console.log('Inquiring...');
    console.log(await getMyEthAccount());
  })();
}

export default getMyEthAccount;