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
    web3 = new Web3(new Web3.providers.HttpProvider("http://10.0.0.8:8545"));
    console.log(web3.net.peerCount);
}

var Web3EthAccounts = require('web3-eth-accounts');

var account = new Web3EthAccounts('ws://10.0.0.8:8546');


//web3.eth.defaultAccount = 0xaf148d7e9c5a1f6ee493f0a808fdc877953bf273;
web3.eth.defaultAccount = web3.eth.accounts[0];

//contract data
var tokenContractABI = [{"constant":true,"inputs":[],"name":"active","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"additionalToken","type":"uint256"}],"name":"increaseTotalSupply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"}],"name":"crowdsale","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"multisig","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenPrice","type":"uint256"}],"name":"changeTokenRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_multisig","type":"address"}],"name":"changeMultiSignatureWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_active","type":"bool"}],"name":"haltAllOperation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fundRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hasEnded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"},{"name":"_initialSupply","type":"uint256"},{"name":"_tokenPrice","type":"uint256"},{"name":"_tokenOwner","type":"address"},{"name":"_startTime","type":"uint256"},{"name":"_endTime","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"HaltTokenAllOperation","type":"event"},{"anonymous":false,"inputs":[],"name":"ResumeTokenAllOperation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"}];
var tokenContractBytecode = "0x60606040526001600c60006101000a81548160ff02191690831515021790555034156200002b57600080fd5b60405162001e5338038062001e53833981016040528080518201919060200180518201919060200180519060200190919080519060200190919080519060200190919080519060200190919080519060200190919080519060200190919050505b620000aa6200024e6401000000000262001923176401000000009004565b8210158015620000ba5750818110155b8015620000c75750600084115b8015620000eb575060008373ffffffffffffffffffffffffffffffffffffffff1614155b1515620000f757600080fd5b816007819055508060088190555087600090805190602001906200011d9291906200025b565b508660019080519060200190620001369291906200025b565b50856002819055508460038190555060035460048190555083600d8190555033600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060035460056000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50505050505050506200030a565b60006103e8420290505b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200029e57805160ff1916838001178555620002cf565b82800160010185558215620002cf579182015b82811115620002ce578251825591602001919060010190620002b1565b5b509050620002de9190620002e2565b5090565b6200030791905b8082111562000303576000816000905550600101620002e9565b5090565b90565b611b39806200031a6000396000f30060606040523615610173576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302fb0c5e1461019c57806306fdde03146101c9578063095ea7b31461025857806318160ddd1461029a5780631d43cc98146102c357806323b872dd146102e65780632f05cda314610347578063313ce567146103755780633197cbb61461039e5780633eaaf86b146103c757806341c0e1b5146103f05780634783c35b146104055780634c7e75f91461045a5780634fbe30d41461048357806369aaa388146104a657806370a08231146104df57806378e979251461052c5780638d859f3e146105555780638da5cb5b1461057e57806395d89b41146105d357806398d5fdca14610662578063a6f9dae11461068b578063a77ab565146106c4578063a9059cbb146106e9578063bbe4fd501461072b578063c71c0b4014610754578063cdcb3cdb1461077d578063dd62ed3e146107a6578063ecb70fb714610812575b5b600c60009054906101000a900460ff16151561018f57600080fd5b6101983361083f565b5b5b005b34156101a757600080fd5b6101af610b00565b604051808215151515815260200191505060405180910390f35b34156101d457600080fd5b6101dc610b13565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561021d5780820151818401525b602081019050610201565b50505050905090810190601f16801561024a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561026357600080fd5b610298600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bb1565b005b34156102a557600080fd5b6102ad610d12565b6040518082815260200191505060405180910390f35b34156102ce57600080fd5b6102e46004808035906020019091905050610d1d565b005b34156102f157600080fd5b610345600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610e8d565b005b610373600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061083f565b005b341561038057600080fd5b61038861122f565b6040518082815260200191505060405180910390f35b34156103a957600080fd5b6103b1611235565b6040518082815260200191505060405180910390f35b34156103d257600080fd5b6103da61123b565b6040518082815260200191505060405180910390f35b34156103fb57600080fd5b610403611241565b005b341561041057600080fd5b6104186112db565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561046557600080fd5b61046d611301565b6040518082815260200191505060405180910390f35b341561048e57600080fd5b6104a46004808035906020019091905050611307565b005b34156104b157600080fd5b6104dd600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061138b565b005b34156104ea57600080fd5b610516600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611449565b6040518082815260200191505060405180910390f35b341561053757600080fd5b61053f611493565b6040518082815260200191505060405180910390f35b341561056057600080fd5b610568611499565b6040518082815260200191505060405180910390f35b341561058957600080fd5b61059161149f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156105de57600080fd5b6105e66114c5565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106275780820151818401525b60208101905061060b565b50505050905090810190601f1680156106545780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561066d57600080fd5b610675611563565b6040518082815260200191505060405180910390f35b341561069657600080fd5b6106c2600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061156e565b005b34156106cf57600080fd5b6106e76004808035151590602001909190505061162c565b005b34156106f457600080fd5b610729600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611719565b005b341561073657600080fd5b61073e611923565b6040518082815260200191505060405180910390f35b341561075f57600080fd5b610767611930565b6040518082815260200191505060405180910390f35b341561078857600080fd5b610790611936565b6040518082815260200191505060405180910390f35b34156107b157600080fd5b6107fc600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611941565b6040518082815260200191505060405180910390f35b341561081d57600080fd5b6108256119c9565b604051808215151515815260200191505060405180910390f35b600080600c60009054906101000a900460ff16151561085d57600080fd5b6108656119dd565b8015610888575060008373ffffffffffffffffffffffffffffffffffffffff1614155b151561089357600080fd5b3491506108b06108a1611563565b83611a1f90919063ffffffff16565b90506108cd670de0b6b3a764000082611a5390919063ffffffff16565b905080600454101515156108e057600080fd5b6108f582600b54611a6f90919063ffffffff16565b600b8190555061096f8160056000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a8e90919063ffffffff16565b60056000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610a2681600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a6f90919063ffffffff16565b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610a7e81600454611a8e90919063ffffffff16565b6004819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f623b3804fa71d67900d064613da8f94b9617215ee90799290593e1745087ad188484604051808381526020018281526020019250505060405180910390a3610af9611aa8565b5b5b505050565b600c60009054906101000a900460ff1681565b60008054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ba95780601f10610b7e57610100808354040283529160200191610ba9565b820191906000526020600020905b815481529060010190602001808311610b8c57829003601f168201915b505050505081565b600c60009054906101000a900460ff161515610bcc57600080fd5b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610c1b5750600081115b1515610c2657600080fd5b80600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a35b5b5050565b600060035490505b90565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d7957600080fd5b610d8e81600354611a6f90919063ffffffff16565b600381905550610da981600454611a6f90919063ffffffff16565b600481905550610e238160056000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a6f90919063ffffffff16565b60056000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b50565b600c60009054906101000a900460ff161515610ea857600080fd5b80600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610f73575080600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b8015610f7f5750600081115b1515610f8a57600080fd5b610fdc81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a8e90919063ffffffff16565b600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061107181600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a6f90919063ffffffff16565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061114381600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a8e90919063ffffffff16565b600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b5b505050565b60025481565b60085481565b60035481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561129d57600080fd5b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561136357600080fd5b600c60009054906101000a900460ff16151561137e57600080fd5b80600d819055505b5b5b50565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156113e757600080fd5b600c60009054906101000a900460ff16151561140257600080fd5b80600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b5b50565b6000600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b60075481565b600d5481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561155b5780601f106115305761010080835404028352916020019161155b565b820191906000526020600020905b81548152906001019060200180831161153e57829003601f168201915b505050505081565b6000600d5490505b90565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115ca57600080fd5b600c60009054906101000a900460ff1615156115e557600080fd5b80600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b5b50565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561168857600080fd5b80600c60006101000a81548160ff021916908315150217905550600c60009054906101000a900460ff16156116e8577f435ae547c7e7f43db1b9df0a3d6ff842056e76fa30fcb1b774af9dcf451a65dc60405160405180910390a1611714565b7e020a2873ed767d5d8d5f92ad90cb8c29e67f089ae67a2af949eb6fcc59381c60405160405180910390a15b5b5b50565b600c60009054906101000a900460ff16151561173457600080fd5b80600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156117835750600081115b151561178e57600080fd5b6117e081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a8e90919063ffffffff16565b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061187581600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611a6f90919063ffffffff16565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b5b5050565b60006103e8420290505b90565b600b5481565b600060045490505b90565b6000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b92915050565b60006008546119d6611923565b1190505b90565b60008060006007546119ed611923565b10158015611a045750600854611a01611923565b11155b915060003414159050818015611a175750805b92505b505090565b60008082840290506000841480611a405750828482811515611a3d57fe5b04145b1515611a4857fe5b8091505b5092915050565b6000808284811515611a6157fe5b0490508091505b5092915050565b6000808284019050838110151515611a8357fe5b8091505b5092915050565b6000828211151515611a9c57fe5b81830390505b92915050565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501515611b0a57600080fd5b5b5600a165627a7a72305820c04cef0587450829edb2df62c8a86e0dc71de186f90783ee2424205f269880980029";

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
  var _startTime = req.body._startTime;
  var _endTime = req.body._endTime;

  var newTokenContract = web3.eth.contract(tokenContractABI);
  newTokenContract.new(_name, _symbol, _decimals, _initialSupply, _tokenPrice, _tokenOwner, _startTime, _endTime, {from: web3.eth.defaultAccount, data: tokenContractBytecode, gas: '4300000'}, function(err, result) {
     //console.log(result);
     if (!err) {
       if(result.address != undefined) {
         //res.end(JSON.stringify(result));
         res.json({"Address" : result.address});
       }
     } else
         res.status(401).json("Error : " + err);
 });
});

app.post('/increaseTokenSupply', function(req, res) {
  var additionalSupply = req.body._additionalSupply;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.increaseTotalSupply.sendTransaction(additionalSupply, { from: web3.eth.defaultAccount,gas:4712388 }, function(err, result) {
      if (!err) {
          res.status(200).json({"status":true, transaction : result});
      } else
          res.status(200).json({"status":false, error : err});
  });
});

app.post('/freezeOrUnfreezeToken', function(req, res) {
  var active = req.body._active;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.haltAllOperation.sendTransaction(active, { from: web3.eth.defaultAccount,gas:4712388 }, function(err, result) {
      if (!err) {
          res.status(200).json({"status":true, transaction : result});
      } else
          res.status(200).json({"status":false, error : err});
  });
});

app.post('/fundRaised', function(req, res) {
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.fundRaised.call(function(err, result) {
      if (!err) {
          res.json({"FundRaised":result});
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
