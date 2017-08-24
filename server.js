var express = require('express'),
    cors = require('cors'),
    app = express();
//var router = express.Router();
var bodyParser = require('body-parser');
var Web3 = require('web3');

var Tx = require('ethereumjs-tx');
var _ = require('lodash');

var SolidityFunction = require('web3/lib/web3/function');
var keythereum = require("keythereum");

var request = require('request');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//session configs
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it


app.use(cookieParser());

app.use(expressSession({
    secret: 'test_session',
    resave: false,
    saveUninitialized: true
}));


//For enabling CORS
app.use(cors());


var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://10.0.0.13:8545"));
    console.log(web3.net.peerCount);
}

var Web3EthAccounts = require('web3-eth-accounts');

var account = new Web3EthAccounts('ws://10.0.0.13:8546');


//web3.eth.defaultAccount = 0xaf148d7e9c5a1f6ee493f0a808fdc877953bf273;
web3.eth.defaultAccount = web3.eth.accounts[0];

//contract data
var tokenContractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"}],"name":"crowdsale","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"_crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"result","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"},{"name":"_initialSupply","type":"uint256"},{"name":"_tokenPrice","type":"uint256"},{"name":"_tokenOwner","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

var tokenContractBytecode = "0x606060405234156200001057600080fd5b604051620014d9380380620014d9833981016040528080518201919060200180518201919060200180519060200190919080519060200190919080519060200190919080519060200190919050505b85600090805190602001906200007792919062000165565b5084600190805190602001906200009092919062000165565b5083600281905550826003819055506003546004819055508160088190555080600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060035460056000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50505050505062000214565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001a857805160ff1916838001178555620001d9565b82800160010185558215620001d9579182015b82811115620001d8578251825591602001919060010190620001bb565b5b509050620001e89190620001ec565b5090565b6200021191905b808211156200020d576000816000905550600101620001f3565b5090565b90565b6112b580620002246000396000f300606060405236156100ef576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100fc578063095ea7b31461018b57806318160ddd146101cd57806323b872dd146101f65780632f05cda314610257578063313ce567146102855780633eaaf86b146102ae57806341c0e1b5146102d75780634c7e75f9146102ec57806370a08231146103155780638d859f3e146103625780638da5cb5b1461038b57806395d89b41146103e057806398d5fdca1461046f578063a9059cbb14610498578063cdcb3cdb146104da578063dd62ed3e14610503575b5b6100f93361056f565b5b005b341561010757600080fd5b61010f610840565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101505780820151818401525b602081019050610134565b50505050905090810190601f16801561017d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561019657600080fd5b6101cb600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506108de565b005b34156101d857600080fd5b6101e0610a23565b6040518082815260200191505060405180910390f35b341561020157600080fd5b610255600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610a2e565b005b610283600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061056f565b005b341561029057600080fd5b610298610db4565b6040518082815260200191505060405180910390f35b34156102b957600080fd5b6102c1610dba565b6040518082815260200191505060405180910390f35b34156102e257600080fd5b6102ea610dc0565b005b34156102f757600080fd5b6102ff610e5a565b6040518082815260200191505060405180910390f35b341561032057600080fd5b61034c600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610e60565b6040518082815260200191505060405180910390f35b341561036d57600080fd5b610375610eaa565b6040518082815260200191505060405180910390f35b341561039657600080fd5b61039e610eb0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103eb57600080fd5b6103f3610ed6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104345780820151818401525b602081019050610418565b50505050905090810190601f1680156104615780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561047a57600080fd5b610482610f74565b6040518082815260200191505060405180910390f35b34156104a357600080fd5b6104d8600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610f7f565b005b34156104e557600080fd5b6104ed61116d565b6040518082815260200191505060405180910390f35b341561050e57600080fd5b610559600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611178565b6040518082815260200191505060405180910390f35b6000803411151561057f57600080fd5b61059961058a610f74565b3461120090919063ffffffff16565b90506105b6670de0b6b3a76400008261123490919063ffffffff16565b905080600454101515156105c957600080fd5b61063d8160056000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461125090919063ffffffff16565b60056000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506106f481600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461126a90919063ffffffff16565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061074c8160045461125090919063ffffffff16565b6004819055508173ffffffffffffffffffffffffffffffffffffffff16600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a3600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050151561083b57600080fd5b5b5050565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108d65780601f106108ab576101008083540402835291602001916108d6565b820191906000526020600020905b8154815290600101906020018083116108b957829003601f168201915b505050505081565b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015801561092d5750600081115b151561093857600080fd5b80600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a35b5050565b600060035490505b90565b80600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610af9575080600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b8015610b055750600081115b1515610b1057600080fd5b610b6281600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461125090919063ffffffff16565b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610bf781600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461126a90919063ffffffff16565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610cc981600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461125090919063ffffffff16565b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b505050565b60025481565b60035481565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e1c57600080fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b60045481565b6000600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b60085481565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f6c5780601f10610f4157610100808354040283529160200191610f6c565b820191906000526020600020905b815481529060010190602001808311610f4f57829003601f168201915b505050505081565b600060085490505b90565b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610fce5750600081115b1515610fd957600080fd5b61102b81600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461125090919063ffffffff16565b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506110c081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461126a90919063ffffffff16565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b5050565b600060045490505b90565b6000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b92915050565b60008082840290506000841480611221575082848281151561121e57fe5b04145b151561122957fe5b8091505b5092915050565b600080828481151561124257fe5b0490508091505b5092915050565b600082821115151561125e57fe5b81830390505b92915050565b600080828401905083811015151561127e57fe5b8091505b50929150505600a165627a7a7230582025b5956f1074a87c9db1277a56173d57744ed7f03faac9e5529363af117d2b140029";

var tokenContract;

app.get('/', function(req, res) {
    res.send("This is the API server developed for ICO Token Contract");
});

app.post('/createAccount', function(req, res) {
    var password = req.body._password;
    var result = account.create();
    var address = result.address;
    var privateKey = result.privateKey;

    var encryptedResult = account.encrypt(privateKey, password);

    res.json({"Address" : address, "PrivateKey" : privateKey, "Keystore" : encryptedResult});
});

app.post('/accessAccountUsingKeystore', function(req, res) {
    var Keystore = req.body.Keystore;
    var password = req.body._password;
    var result = account.decrypt(Keystore, password);

    var address = result.address;
    var privateKey = result.privateKey;

    res.json({"Address" : address, "PriateKey" : privateKey});
});

app.post('/accessAccountUsingPrivateKey', function(req, res) {
    var privateKey = req.body._privateKey;
    var result = account.privateKeyToAccount(privateKey);

    var address = result.address;
    var privateKey = result.privateKey;
    console.log(web3.eth.defaultAccount);
    res.json({"Address" : address, "PriateKey" : privateKey});
});

app.post('/createToken', function(req, res) {
  var _name = req.body._name;
  var _symbol = req.body._symbol;
  var _decimals = req.body._decimals;
  var _initialSupply = req.body._initialSupply;
  var _tokenPrice = req.body._tokenPrice;
  var _tokenOwner = req.body._tokenOwner;

  var newTokenContract = web3.eth.contract(tokenContractABI);
  newTokenContract.new(_name, _symbol, _decimals, _initialSupply, _tokenPrice, _tokenOwner, {from: web3.eth.defaultAccount, data: tokenContractBytecode, gas: '4300000'}, function(err, result) {
     //console.log(result);
     if (!err) {
       if(result.address != undefined) {
         //res.end(JSON.stringify(result));
         res.json({"Address" : result.address});
       }
     } else
         res.status(401).json("Error" + err);
 });

});

app.post('/myTokenBalance', function(req, res) {
  var address = req.body._address;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.balanceOf.call(address, function(err, result) {
      //console.log(result);
      if (!err) {
          res.json({"balance":result});
      } else
          res.status(401).json("Error" + err);
  });
});

app.post('/transferToken', function(req, res) {
  var fromaddress = req.body._fromaddress;
  var toaddress = req.body._toaddress;
  var amount = req.body._amount;
  var privatekey = req.body._privatekey;
  var tokenAddress = req.body._tokenAddress;

  // step 1
  var solidityFunction = new SolidityFunction('', _.find(tokenContractABI, { name: 'transfer' }), '');

  // Step 2
  var payloadData = solidityFunction.toPayload([toaddress, amount]).data;

  // Step 3
  gasPrice = web3.eth.gasPrice;
  gasPriceHex = web3.toHex(gasPrice);
  gasLimitHex = web3.toHex(300000);

  nonce =  web3.eth.getTransactionCount(fromaddress) ;
  nonceHex = web3.toHex(nonce);

  var rawTx = {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: tokenAddress,
      from: fromaddress,
      value: '0x00',
      data: payloadData
  };

  // Step 4
  var key = Buffer.from(privatekey, 'hex');
  var tx = new Tx(rawTx);
  tx.sign(key);

  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
      if (err) {
          res.status(401).json("" + err);
      }
      else {
          res.json({"status":true, "hash" : hash});
      }
  });
});

app.post('/buyToken', function(req, res) {
  var fromaddress = req.body._fromaddress;
  var amount = req.body._amount;
  var privatekey = req.body._privatekey;
  var tokenAddress = req.body._tokenAddress;

  // Step 1
  var payloadData = web3.toHex(web3.toWei(amount, 'ether'));

  // Step 2
  gasPrice = web3.eth.gasPrice;
  gasPriceHex = web3.toHex(gasPrice);
  gasLimitHex = web3.toHex(300000);

  nonce =  web3.eth.getTransactionCount(fromaddress) ;
  nonceHex = web3.toHex(nonce);

  var rawTx = {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: tokenAddress,
      from: fromaddress,
      value: payloadData,
      data: '0x00'
  };

  // Step 3
  var key = Buffer.from(privatekey, 'hex');
  var tx = new Tx(rawTx);
  tx.sign(key);

  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
      if (err) {
          res.status(401).json("" + err);
      }
      else {
          res.json({"status":true, "hash" : hash});
      }
  });
});

app.post('/sendEther', function(req, res) {
  var fromaddress = req.body._fromaddress;
  var amount = req.body._amount;
  var privatekey = req.body._privatekey;
  var toAddress = req.body._toAddress;

  // Step 1
  var payloadData = web3.toHex(web3.toWei(amount, 'ether'));

  // Step 2
  gasPrice = web3.eth.gasPrice;
  gasPriceHex = web3.toHex(gasPrice);
  gasLimitHex = web3.toHex(300000);

  nonce =  web3.eth.getTransactionCount(fromaddress) ;
  nonceHex = web3.toHex(nonce);

  var rawTx = {
      nonce: nonceHex,
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: toAddress,
      from: fromaddress,
      value: payloadData,
      data: '0x00'
  };

  // Step 3
  var key = Buffer.from(privatekey, 'hex');
  var tx = new Tx(rawTx);
  tx.sign(key);

  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
      if (err) {
          res.status(401).json("" + err);
      }
      else {
          res.json({"status":true, "hash" : hash});
      }
  });
});

app.listen(3007, function() {
    console.log('app running on port : 3007');
});
