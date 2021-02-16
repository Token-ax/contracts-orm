# contracts-orm

In this repository we will be building an ORM that takes JSON files like tweet.json and defines the data model similar to a rails ORM or sql alchemy. 
This will be used to automatically generate solidity smart contracts like the one in out.sol. from here additional tooling will be created to automaticaly generate javascript bindings. this may just be kept in this repo.

the idea is that we can go from a json file to a full blockchain application automatically without any code. Also it would be amazing to be able to generate and manage those json files through a web application, allowing for literally zero code blockcahin apps.

In addition I want to support ERC20, ERC721, ERC918, etc ERC proposals within the JSON so that creating a token will be as easy as 

{
  "contracts": {
    "TokenName": "ERC20" 
  }
}

Or something. Looking forward to writing a spec that supports automatic and easy smart contract creation through json and also allows for custom code within the json.

This is all meant to be supported by the token.ax dev hosting environment for free easy gas-less block chain apps!
