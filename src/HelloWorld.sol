// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract HelloWorld {
  function getSender() public view returns (address) {
    return msg.sender;
  }

  function getBalance() public view returns (uint256) {
    return address(msg.sender).balance;
  }
}