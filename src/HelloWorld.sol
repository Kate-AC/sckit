pragma solidity ^0.8.10;

contract HelloWorlda {
  function getSender() public returns (address) {
    return msg.sender;
  }

  function getBalance() public returns (uint256) {
    return address(msg.sender).balance;
  }
}