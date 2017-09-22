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
    web3 = new Web3(new Web3.providers.HttpProvider("http://10.0.0.17:8545"));
    console.log(web3.net.peerCount);
}

var Web3EthAccounts = require('web3-eth-accounts');

var account = new Web3EthAccounts('ws://10.0.0.17:8546');


//web3.eth.defaultAccount = 0xaf148d7e9c5a1f6ee493f0a808fdc877953bf273;
web3.eth.defaultAccount = web3.eth.accounts[0];

//contract data
var tokenContractABI = [{"constant":true,"inputs":[],"name":"active","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"additionalToken","type":"uint256"}],"name":"increaseTotalSupply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"}],"name":"crowdsaleProcess","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_endTime","type":"uint256"}],"name":"changeEndTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"multisig","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenPrice","type":"uint256"}],"name":"changeTokenRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_multisig","type":"address"}],"name":"changeMultiSignatureWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_startTime","type":"uint256"}],"name":"changeStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdsale","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_active","type":"bool"}],"name":"haltAllOperation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fundRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_crowdsale","type":"bool"}],"name":"pauseResumeCrowdsale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasEnded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_initialSupply","type":"uint256"},{"name":"_tokenPrice","type":"uint256"},{"name":"_tokenOwner","type":"address"},{"name":"_startTime","type":"uint256"},{"name":"_endTime","type":"uint256"},{"name":"_crowdsalePercentage","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"HaltTokenAllOperation","type":"event"},{"anonymous":false,"inputs":[],"name":"ResumeTokenAllOperation","type":"event"},{"anonymous":false,"inputs":[],"name":"ResumeCrowdsale","type":"event"},{"anonymous":false,"inputs":[],"name":"PausedCrowdsale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"}];

var tokenContractBytecode = "0x6060604052600c805461ff001960ff1990911660011716905534156200002457600080fd5b6040516200151a3803806200151a8339810160405280805182019190602001805182019190602001805191906020018051919060200180519190602001805191906020018051919060200180519150505b6000851180156200008e5750600160a060020a03841615155b80156200009b5750600081115b8015620000a9575060648111155b1515620000b557600080fd5b600783905560088290556000888051620000d4929160200190620001f8565b506001878051620000ea929160200190620001f8565b5060126002556200011286670de0b6b3a764000064010000000062001189620001a982021704565b60038190556200014e9060649062000139908464010000000062001189620001a982021704565b9064010000000062001220620001db82021704565b600455600d85905560098054600160a060020a03338116600160a060020a031992831617909255600a80548784169216919091179081905560035491166000908152600560205260409020555b5050505050505050620002a2565b6000828202831580620001c75750828482811515620001c457fe5b04145b1515620001d057fe5b8091505b5092915050565b6000808284811515620001ea57fe5b0490508091505b5092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200023b57805160ff19168380011785556200026b565b828001600101855582156200026b579182015b828111156200026b5782518255916020019190600101906200024e565b5b506200027a9291506200027e565b5090565b6200029f91905b808211156200027a576000815560010162000285565b5090565b90565b61126880620002b26000396000f3006060604052361561019e5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166302fb0c5e81146101d457806306fdde03146101fb578063095ea7b31461028657806318160ddd146102aa5780631d43cc98146102cf57806323b872dd146102e7578063288081ab146103115780633052b75e14610327578063313ce5671461033f5780633197cbb6146103645780633eaaf86b1461038957806341c0e1b5146103ae5780634783c35b146103c35780634c7e75f9146103f25780634fbe30d41461041757806369aaa3881461042f57806370a082311461045057806378e97925146104815780638aa5b2c3146104a65780638d859f3e146104be5780638da5cb5b146104e357806395d89b411461051257806398d5fdca1461059d5780639c1e03a0146105c2578063a6f9dae1146105e9578063a77ab5651461060a578063a9059cbb14610624578063bbe4fd5014610648578063c71c0b401461066d578063cdcb3cdb14610692578063dd62ed3e146106b7578063e3eac77e146106ee578063ecb70fb714610708575b5b600c5460ff1615156101b057600080fd5b600c54610100900460ff1615156101c657600080fd5b6101cf3361072f565b5b5b5b005b34156101df57600080fd5b6101e76108b0565b604051901515815260200160405180910390f35b341561020657600080fd5b61020e6108b9565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561024b5780820151818401525b602001610232565b50505050905090810190601f1680156102785780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561029157600080fd5b6101cf600160a060020a0360043516602435610957565b005b34156102b557600080fd5b6102bd610a02565b60405190815260200160405180910390f35b34156102da57600080fd5b6101cf600435610a09565b005b34156102f257600080fd5b6101cf600160a060020a0360043581169060243516604435610a9b565b005b6101cf600160a060020a036004351661072f565b005b341561033257600080fd5b6101cf600435610c23565b005b341561034a57600080fd5b6102bd610c5a565b60405190815260200160405180910390f35b341561036f57600080fd5b6102bd610c60565b60405190815260200160405180910390f35b341561039457600080fd5b6102bd610c66565b60405190815260200160405180910390f35b34156103b957600080fd5b6101cf610c6c565b005b34156103ce57600080fd5b6103d6610c98565b604051600160a060020a03909116815260200160405180910390f35b34156103fd57600080fd5b6102bd610ca7565b60405190815260200160405180910390f35b341561042257600080fd5b6101cf600435610cad565b005b341561043a57600080fd5b6101cf600160a060020a0360043516610ce4565b005b341561045b57600080fd5b6102bd600160a060020a0360043516610d3e565b60405190815260200160405180910390f35b341561048c57600080fd5b6102bd610d5d565b60405190815260200160405180910390f35b34156104b157600080fd5b6101cf600435610d63565b005b34156104c957600080fd5b6102bd610d9a565b60405190815260200160405180910390f35b34156104ee57600080fd5b6103d6610da0565b604051600160a060020a03909116815260200160405180910390f35b341561051d57600080fd5b61020e610daf565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561024b5780820151818401525b602001610232565b50505050905090810190601f1680156102785780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156105a857600080fd5b6102bd610e4d565b60405190815260200160405180910390f35b34156105cd57600080fd5b6101e7610e54565b604051901515815260200160405180910390f35b34156105f457600080fd5b6101cf600160a060020a0360043516610e62565b005b341561061557600080fd5b6101cf6004351515610ebc565b005b341561062f57600080fd5b6101cf600160a060020a0360043516602435610f51565b005b341561065357600080fd5b6102bd611052565b60405190815260200160405180910390f35b341561067857600080fd5b6102bd61105b565b60405190815260200160405180910390f35b341561069d57600080fd5b6102bd611061565b60405190815260200160405180910390f35b34156106c257600080fd5b6102bd600160a060020a0360043581169060243516611068565b60405190815260200160405180910390f35b34156106f957600080fd5b6101cf6004351515611095565b005b341561071357600080fd5b6101e7611136565b604051901515815260200160405180910390f35b600c54600090819060ff16151561074557600080fd5b600c54610100900460ff16151561075b57600080fd5b61076361114a565b80156107775750600160a060020a03831615155b151561078257600080fd5b34915061079d610790610e4d565b839063ffffffff61118916565b905080600454101515156107b057600080fd5b600b546107c3908363ffffffff6111b816565b600b55600a54600160a060020a03166000908152600560205260409020546107f1908263ffffffff6111d216565b600a54600160a060020a039081166000908152600560205260408082209390935590851681522054610829908263ffffffff6111b816565b600160a060020a038416600090815260056020526040902055600454610855908263ffffffff6111d216565b600455600160a060020a038084169033167f623b3804fa71d67900d064613da8f94b9617215ee90799290593e1745087ad18848460405191825260208201526040908101905180910390a36108a86111e9565b5b5b5b505050565b600c5460ff1681565b60008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561094f5780601f106109245761010080835404028352916020019161094f565b820191906000526020600020905b81548152906001019060200180831161093257829003601f168201915b505050505081565b600c5460ff16151561096857600080fd5b600160a060020a0333166000908152600560205260409020548190108015906109915750600081115b151561099c57600080fd5b600160a060020a03338116600081815260066020908152604080832094871680845294909152908190208490557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259084905190815260200160405180910390a35b5b5050565b6003545b90565b60095433600160a060020a03908116911614610a2457600080fd5b600354610a37908263ffffffff6111b816565b600355600454610a4d908263ffffffff6111b816565b600455600a54600160a060020a0316600090815260056020526040902054610a7b908263ffffffff6111b816565b600a54600160a060020a03166000908152600560205260409020555b5b50565b600c5460ff161515610aac57600080fd5b600160a060020a0380841660009081526006602090815260408083203390941683529290522054819010801590610afc5750600160a060020a038316600090815260056020526040902054819010155b8015610b085750600081115b1515610b1357600080fd5b600160a060020a038316600090815260056020526040902054610b3c908263ffffffff6111d216565b600160a060020a038085166000908152600560205260408082209390935590841681522054610b71908263ffffffff6111b816565b600160a060020a03808416600090815260056020908152604080832094909455868316825260068152838220339093168252919091522054610bb9908263ffffffff6111d216565b600160a060020a03808516600081815260066020908152604080832033861684529091529081902093909355908416917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b5b505050565b60095433600160a060020a03908116911614610c3e57600080fd5b600c5460ff161515610c4f57600080fd5b60088190555b5b5b50565b60025481565b60085481565b60035481565b60095433600160a060020a03908116911614610c8757600080fd5b600954600160a060020a0316ff5b5b565b600a54600160a060020a031681565b60045481565b60095433600160a060020a03908116911614610cc857600080fd5b600c5460ff161515610cd957600080fd5b600d8190555b5b5b50565b60095433600160a060020a03908116911614610cff57600080fd5b600c5460ff161515610d1057600080fd5b600a805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b600160a060020a0381166000908152600560205260409020545b919050565b60075481565b60095433600160a060020a03908116911614610d7e57600080fd5b600c5460ff161515610d8f57600080fd5b60078190555b5b5b50565b600d5481565b600954600160a060020a031681565b60018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561094f5780601f106109245761010080835404028352916020019161094f565b820191906000526020600020905b81548152906001019060200180831161093257829003601f168201915b505050505081565b600d545b90565b600c54610100900460ff1681565b60095433600160a060020a03908116911614610e7d57600080fd5b600c5460ff161515610e8e57600080fd5b6009805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b60095433600160a060020a03908116911614610ed757600080fd5b600c805460ff1916821515179081905560ff1615610f20577f435ae547c7e7f43db1b9df0a3d6ff842056e76fa30fcb1b774af9dcf451a65dc60405160405180910390a1610a97565b7e020a2873ed767d5d8d5f92ad90cb8c29e67f089ae67a2af949eb6fcc59381c60405160405180910390a15b5b5b50565b600c5460ff161515610f6257600080fd5b600160a060020a033316600090815260056020526040902054819010801590610f8b5750600081115b1515610f9657600080fd5b600160a060020a033316600090815260056020526040902054610fbf908263ffffffff6111d216565b600160a060020a033381166000908152600560205260408082209390935590841681522054610ff4908263ffffffff6111b816565b600160a060020a0380841660008181526005602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b5b5050565b6103e842025b90565b600b5481565b6004545b90565b600160a060020a038083166000908152600660209081526040808320938516835292905220545b92915050565b60095433600160a060020a039081169116146110b057600080fd5b600c805461ff0019166101008315158102919091179182905560ff91041615611104577fb7742082702fcc9140a8dbb24b7959083569c04db9dd144f3999a4701e72ee7160405160405180910390a1610a97565b7f493425085f7b94cfb1e378db2c712ecb7018a932a45d90c616ee04ca607842b160405160405180910390a15b5b5b50565b6000600854611143611052565b1190505b90565b600080600060075461115a611052565b10158015611171575060085461116e611052565b11155b9150503415158180156111815750805b92505b505090565b60008282028315806111a557508284828115156111a257fe5b04145b15156111ad57fe5b8091505b5092915050565b6000828201838110156111ad57fe5b8091505b5092915050565b6000828211156111de57fe5b508082035b92915050565b600a54600160a060020a03163480156108fc0290604051600060405180830381858888f193505050501515610c9557600080fd5b5b565b600080828481151561122e57fe5b0490508091505b50929150505600a165627a7a7230582014d2e5313bc7852481ddf5b5eb557bd98a36ae1c129b6f3c8fd4ac2858ea5a810029";

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
  var _initialSupply = req.body._initialSupply;
  var _tokenPrice = req.body._tokenPrice;
  var _tokenOwner = req.body._tokenOwner;
  var _startTime = req.body._startTime;
  var _endTime = req.body._endTime;
  var _crowdsalePercentage = req.body._crowdsalePercentage;

  var newTokenContract = web3.eth.contract(tokenContractABI);
  newTokenContract.new(_name, _symbol, _initialSupply, _tokenPrice, _tokenOwner, _startTime, _endTime, _crowdsalePercentage, {from: web3.eth.defaultAccount, data: tokenContractBytecode, gas: '4300000'}, function(err, result) {
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

app.post('/pauseOrResumeCrowdsale', function(req, res) {
  var status = req.body._status;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.pauseResumeCrowdsale.sendTransaction(status, { from: web3.eth.defaultAccount,gas:4712388 }, function(err, result) {
      if (!err) {
          res.status(200).json({"status":true, transaction : result});
      } else
          res.status(200).json({"status":false, error : err});
  });
});

app.post('/changeStartTime', function(req, res) {
  var startTime = req.body._startTime;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.changeStartTime.sendTransaction(startTime, { from: web3.eth.defaultAccount,gas:4712388 }, function(err, result) {
      if (!err) {
          res.status(200).json({"status":true, transaction : result});
      } else
          res.status(200).json({"status":false, error : err});
  });
});

app.post('/changeEndTime', function(req, res) {
  var endTime = req.body._endTime;
  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.changeEndTime.sendTransaction(endTime, { from: web3.eth.defaultAccount,gas:4712388 }, function(err, result) {
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

app.post('/isTokenActive', function(req, res) {

  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.active.call(function(err, result) {
      if (!err) {
          res.status(200).json({"result":result});
      } else
          res.status(200).json({"status":false, error : err});
  });
});

app.post('/isCrowdsaleActive', function(req, res) {

  var tokenAddress = req.body._tokenAddress;
  tokenContract = web3.eth.contract(tokenContractABI).at(tokenAddress);

  tokenContract.crowdsale.call(function(err, result) {
      if (!err) {
          res.status(200).json({"result":result});
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
