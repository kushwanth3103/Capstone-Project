//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns(uint256);
    //function transfer(address recipient,uint256 amount) external returns (bool);
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
    //function allowance(address owner,address spender) external view returns (uint256);
    //function approve(address spender,uint256 amount) external returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
}

contract ERC20Token is IERC20 {
    uint public constant decimals = 18;

    mapping(address => uint256) public balances;
    uint256 totalSupply_ = 10 ether;

    function totalSupply() public override view returns (uint256){
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256){
        return balances[tokenOwner];
    }

    function transferFrom(address sender,address recipient,uint256 amount) public override returns (bool){
        balances[sender]=balances[sender]-(amount);
        balances[recipient]=balances[recipient]+amount;
        emit Transfer(msg.sender,recipient,amount);
        return true;
    }

    function mint(uint256 tokens,address _owner)internal returns (bool){
      totalSupply_=totalSupply_+(tokens);
      balances[_owner]=balances[_owner]+(tokens);
      emit Transfer(address(0),_owner,tokens);
      return true;
    }


}