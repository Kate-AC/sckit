import Web3 from 'web3';
import helloWorldContract from '../built/HelloWorldContract';
import getMyEthAccount from '../libs/getMyEthAccount';

(async () => {
  const web3 = new Web3('http://eth:8545');
  web3.eth.defaultAccount = await getMyEthAccount();

  const contract = new web3.eth.Contract(
    helloWorldContract.abi,
    helloWorldContract.address
  );

  contract.methods.getSender()
    .call()
    .then((response: any) => {
      console.log(response);
    });
})();
