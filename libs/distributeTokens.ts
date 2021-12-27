import Web3 from 'web3';
import listEthAccount from './listEthAccount';
import deployContract from './deployContract';
import testUSDTTokenContract from '../contracts/TestUSDTTokenContract';
import testVLXTokenContract from '../contracts/TestVLXTokenContract';

(async () => {
  const web3 = new Web3(process.env.REACT_APP_GETH_URL ?? 'http://eth:8545');
  const list = await listEthAccount();

  const addressUSDT: string = await deployContract(
    list[0],
    testUSDTTokenContract.binary,
    JSON.stringify(testUSDTTokenContract.abi)
  );

  const addressVLX: string = await deployContract(
    list[0],
    testVLXTokenContract.binary,
    JSON.stringify(testVLXTokenContract.abi)
  );

  const contractUSDT = new web3.eth.Contract(
    testUSDTTokenContract.abi,
    addressUSDT
  );

  const contractVLX = new web3.eth.Contract(
    testVLXTokenContract.abi,
    addressVLX
  );

  await web3.eth.personal.unlockAccount(list[0], '', 300);

  await contractUSDT.methods
    .transfer(process.env.REACT_APP_WALLET_ADDRESS ?? '', 100000000000)
    .send({
      from: list[0]
    });

  await contractVLX.methods
    .transfer(process.env.REACT_APP_WALLET_ADDRESS ?? '', 100000000000)
    .send({
      from: list[0]
    });

  console.log('USDT: ' + addressUSDT);
  console.log('VLX: ' + addressVLX);
})();
