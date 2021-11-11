pragma solidity ^0.8.10;

contract HelloWorld {
  string message;

  function setMessage(string memory _message) public returns (bool) {
    message = _message;
    return true;
  }

  function sayHello() public returns (string memory) {
    return message;
  }
}