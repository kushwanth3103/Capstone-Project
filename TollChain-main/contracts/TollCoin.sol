//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract TollCoin is ERC20Token {
    using SafeMath for uint256;

    string public constant name="TollCoin";
    string public constant symbol="TC";
    address payable public owner;

    constructor(){
        owner = payable(msg.sender);
    }

    struct user{
        string vehicleNum;
        string userName;
        uint256 userBalance;
        bool userExists;
    }

    struct contractor{
        string contractorName;
        uint256 cBalance;
        bool cExists;
    }

    struct rfidUser{
        address userAd;
        bool userExist;
    }

    struct receipt{
        string vehicleNum;
        string name;
        string contractorName;
        uint256 tokenAmount;
    }
    receipt[] tollReceipts;

    mapping(address=>user) public UsersReg;
    mapping(address=>contractor) public ContractorsReg;
    //Map rfid with address of user
    mapping(string=>rfidUser) public rfidMap;
    modifier onlyOwner{        
        _;
    }

    modifier onlyContractor{
        require(contractorExists(msg.sender),"Only contractor can withdraw tokens");
        _;
    }


    //Register new users
    function newUser(address _userAd,string memory _vehicleNum,string memory _rfidCode,string memory _userName) public returns(bool){
        require(_userAd!=address(0),"Invalid address");
        require(_userAd!=owner,"Owner cant be user");
        require(UsersReg[_userAd].userExists==false,"User Exists!");
        require(ContractorsReg[_userAd].cExists==false,"Contractor cant be registered as user.");
        UsersReg[_userAd]= user({vehicleNum:_vehicleNum,userName:_userName,userBalance:0,userExists:true});
        balances[_userAd]=uint256(0);
        rfidMap[_rfidCode]=rfidUser({userAd:_userAd,userExist:true});
        return true;
    }
    /*
    function registerUser (address _user, string memory _vehicleNum) public onlyOwner returns (bool) {
        require(_user!= owner, "Owner cannot be registered as User!");
        require(UserReg[_user].userExists == false, "User already exists!");
        UserReg[_user] = users(_vehicleNum, 0, block.timestamp.sub(1 minutes), true);
        return true;
    }*/

    //Register new contractor
    function newContractor(address _cAdd,string memory _contactorName) public onlyOwner returns(bool){
        require(_cAdd!=address(0),"Invalid Address");
        require(_cAdd!=owner,"Owner cant be contractor");
        require(UsersReg[_cAdd].userExists==false,"Registered user cant be contractor");
        require(ContractorsReg[_cAdd].cExists==false,"Contractor already exists");
        balances[_cAdd]=0;
        ContractorsReg[_cAdd]=contractor(_contactorName,0,true);
        return true;
    }

    //Check Balance of user
    function checkBal(address _user) public view returns(uint256){
        require(_user!=address(0),"Invalid Address");
        require(UsersReg[_user].userExists==true,"User doesnt exists");
        return UsersReg[_user].userBalance;
    }

    //Get User profile
    function getUserProfile(address _user)public view returns(string memory,string memory,uint256){
        require(_user!=address(0),"Invalid Address");
        require(UsersReg[_user].userExists==true,"User doesnt exists");
        return (UsersReg[_user].userName,UsersReg[_user].vehicleNum,UsersReg[_user].userBalance);
    }

    //Get Contractor profile
    function getContractorProfile(address _cont) public view returns(string memory,uint256){
        require(_cont!=address(0),"Invalid Address");
        require(ContractorsReg[address(_cont)].cExists==true,"User doesnt exists");
        return (ContractorsReg[address(_cont)].contractorName,ContractorsReg[_cont].cBalance);
    }

    //Buy tokens
    function buyTokens(address _user,uint _token) public payable{
        require(_user!=address(0),"Invalid address");
        require(UsersReg[_user].userExists==true,"User doesnt exist");
        require(_user.balance>=_token*(0.001 ether),"Insufficient ether balance in user's account");
        if(balances[owner]<=_token*(0.001 ether)){
            mint(10000,owner);
        }
        owner.transfer(_token*(0.001 ether));
        balances[owner]=balances[owner].sub(_token);
        balances[_user]=balances[_user].add(_token);
        UsersReg[_user].userBalance=balances[_user];
    }

    //Pay toll
    function payToll(address _cont,address _user,uint256 amount) public returns(bool){
        require(_cont!=address(0),"Invalid address of contractor");
        require(_user!=address(0),"Invalid address of user");
        require(UsersReg[_user].userExists==true,"User doesnt exist");
        require(ContractorsReg[_cont].cExists==true,"Contractor doesnt exist");
        require(UsersReg[_user].userBalance>=amount,"Insufficient balance");
        transferFrom(_user,_cont,amount);
        UsersReg[_user].userBalance=balanceOf(_user);
        ContractorsReg[_cont].cBalance=balanceOf(_cont);
        receipt memory _tollReceipt = receipt(UsersReg[_user].vehicleNum,UsersReg[_user].userName,ContractorsReg[_cont].contractorName,amount);
        tollReceipts.push(_tollReceipt);
        return true;
    }

    //Contractor withdraw money
    function withDrawTokens(address payable _contAdd,uint _tokens) public payable onlyContractor returns(bool){
        require(ContractorsReg[_contAdd].cExists==true,"Contractor doesnt exist");
        require(ContractorsReg[_contAdd].cBalance>=_tokens,"Insufficient balance to withdraw");
        transferFrom(_contAdd,owner,_tokens);
        _contAdd.transfer(_tokens*(0.001 ether));
        ContractorsReg[_contAdd].cBalance=balanceOf(_contAdd);
        return true;
    }

    function rfidUserId(string memory rfidCode) public view returns(address){
        //require(keccak256(abi.encodePacked((rfidCode))) == keccak256(abi.encodePacked((""))),"RFID code is not valid");
        require(rfidMap[rfidCode].userExist==true,"Invalid user");
        return rfidMap[rfidCode].userAd;
    }

    function contractorExists(address _contAdd) public view returns(bool){
        return ContractorsReg[_contAdd].cExists;
    }

    function getTransactionList() public view onlyOwner returns(receipt[] memory){
        return tollReceipts;
    }

}