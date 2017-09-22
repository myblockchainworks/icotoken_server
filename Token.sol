pragma solidity ^0.4.11;

library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title Token
 */
contract Token {

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event HaltTokenAllOperation();
    event ResumeTokenAllOperation();
    event ResumeCrowdsale();
    event PausedCrowdsale();
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    using SafeMath for uint256;

    // Token properties
    string public name;
    string public symbol;
    uint public decimals;
    uint public _totalSupply;
    uint256 public _crowdsaleSupply;

    // Balances for each account
    mapping (address => uint256) balances;

    // Owner of account approves the transfer of an amount to another account
    mapping (address => mapping(address => uint256)) allowed;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public startTime;
    uint256 public endTime;

    // Token Owner
    address public owner;

    // Wallet Address of Token
    address public multisig;

    // amount of raised money in wei
    uint256 public fundRaised;

    bool public active = true;

    bool public crowdsale = false;

    // 1 ether = 300 token
    uint public PRICE;

    // modifier to allow only owner has full control on the function
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier isActive() {
        require(active);
        _;
    }

    modifier isCrowdsale() {
        require(crowdsale);
        _;
    }

    // Delete / kill the contract... only the owner has rights to do this
    function kill() onlyOwner {
      suicide(owner);
    }

    // Constructor
    // @notice Token Contract
    // @return the transaction address
    function Token(string _name, string _symbol, uint _initialSupply, uint _tokenPrice, address _tokenOwner, uint256 _startTime, uint256 _endTime, uint _crowdsalePercentage) {
        require(_tokenPrice > 0 && _tokenOwner != 0x0 && _crowdsalePercentage > 0 && _crowdsalePercentage <= 100);

        startTime = _startTime;
        endTime = _endTime;

        name = _name;
        symbol = _symbol;
        decimals = 18;
        _totalSupply = _initialSupply.mul(1 ether);
        _crowdsaleSupply = _totalSupply.mul(_crowdsalePercentage).div(100);
        PRICE = _tokenPrice;

        owner = msg.sender;

        multisig = _tokenOwner;

        balances[multisig] = _totalSupply;
    }

    function increaseTotalSupply(uint additionalToken) onlyOwner {
        _totalSupply = _totalSupply.add(additionalToken);
        _crowdsaleSupply = _crowdsaleSupply.add(additionalToken);
        balances[multisig] = balances[multisig].add(additionalToken);
    }

    // Set/change Multi-signature wallet address
    function changeMultiSignatureWallet (address _multisig) onlyOwner isActive {
        multisig = _multisig;
    }

    // Change ETH/Token exchange rate
    function changeTokenRate(uint _tokenPrice) onlyOwner isActive {
        PRICE = _tokenPrice;
    }

    // Change Token contract owner
    function changeOwner(address _newOwner) onlyOwner isActive {
        owner = _newOwner;
    }

    function changeStartTime(uint256 _startTime) onlyOwner isActive {
       startTime = _startTime;
    }

    function changeEndTime(uint256 _endTime) onlyOwner isActive {
       endTime = _endTime;
    }

    // Payable method
    // @notice Anyone can buy the tokens on crowdsale by paying ether
    function () payable isActive isCrowdsale  {
        crowdsaleProcess(msg.sender);
    }

    // @notice crowdsale process
    // @param recipient The address of the recipient
    // @return the transaction address and send the event as Transfer
    function crowdsaleProcess(address recipient) payable isActive isCrowdsale {
        require (
            validPurchase() && recipient != 0x0
        );

        uint256 weiAmount = msg.value;

        uint tokens = weiAmount.mul(getPrice());
        //tokens = tokens.div(1 ether);

        require (
            _crowdsaleSupply >= tokens
        );

         // update state
        fundRaised = fundRaised.add(weiAmount);

        balances[multisig] = balances[multisig].sub(tokens);
        balances[recipient] = balances[recipient].add(tokens);
        _crowdsaleSupply = _crowdsaleSupply.sub(tokens);

        TokenPurchase(msg.sender, recipient, weiAmount, tokens);

        forwardFunds();
    }

    // send ether to the fund collection wallet
    // override to create custom fund forwarding mechanisms
    function forwardFunds() internal {
        multisig.transfer(msg.value);
    }

    // @return true if the transaction can buy tokens
    function validPurchase() internal constant returns (bool) {
        bool withinPeriod = getNow() >= startTime && getNow() <= endTime;
        bool nonZeroPurchase = msg.value != 0;
        return withinPeriod && nonZeroPurchase;
    }

    // Halt or Resume all operations on contract & Crowd Sale
    function pauseResumeCrowdsale(bool _crowdsale) onlyOwner {
        crowdsale = _crowdsale;
        if (crowdsale)
            ResumeCrowdsale();
        else
           PausedCrowdsale();
    }

    // Halt or Resume all operations on contract & Crowd Sale
    function haltAllOperation(bool _active) onlyOwner {
        active = _active;
        if (active)
            ResumeTokenAllOperation();
        else
            HaltTokenAllOperation();
    }

    // @return total tokens supplied
    function totalSupply() constant returns (uint256) {
        return _totalSupply;
    }

    // @return total crowdsale tokens supplied
    function crowdsaleSupply() constant returns (uint256) {
        return _crowdsaleSupply;
    }

    // @return true if crowdsale current lot event has ended
    function hasEnded() public constant returns (bool) {
        return getNow() > endTime;
    }

    function getNow() public constant returns (uint) {
        return (now * 1000);
    }

    // What is the balance of a particular account?
    // @param who The address of the particular account
    // @return the balanace the particular account
    function balanceOf(address who) constant returns (uint256) {
        return balances[who];
    }

    // @notice send `value` token to `to` from `msg.sender`
    // @param to The address of the recipient
    // @param value The amount of token to be transferred
    // @return the transaction address and send the event as Transfer
    function transfer(address to, uint256 value) isActive {
        require (
            balances[msg.sender] >= value && value > 0
        );
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        Transfer(msg.sender, to, value);
    }

    // @notice send `value` token to `to` from `from`
    // @param from The address of the sender
    // @param to The address of the recipient
    // @param value The amount of token to be transferred
    // @return the transaction address and send the event as Transfer
    function transferFrom(address from, address to, uint256 value) isActive {
        require (
            allowed[from][msg.sender] >= value && balances[from] >= value && value > 0
        );
        balances[from] = balances[from].sub(value);
        balances[to] = balances[to].add(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        Transfer(from, to, value);
    }

    // Allow spender to withdraw from your account, multiple times, up to the value amount.
    // If this function is called again it overwrites the current allowance with value.
    // @param spender The address of the sender
    // @param value The amount to be approved
    // @return the transaction address and send the event as Approval
    function approve(address _spender, uint256 _value) isActive {
        require (
            balances[msg.sender] >= _value && _value > 0
        );
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
    }

    // Check the allowed value for the spender to withdraw from owner
    // @param owner The address of the owner
    // @param spender The address of the spender
    // @return the amount which spender is still allowed to withdraw from owner
    function allowance(address _owner, address _spender) constant returns (uint256) {
        return allowed[_owner][_spender];
    }

    // Get current price of a Token
    // @return the price or token value for a ether
    function getPrice() constant returns (uint result) {
      return PRICE;
    }
}
