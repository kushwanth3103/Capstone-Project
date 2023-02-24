try{
const express =  require('express');
const app=express();
const cors = require('cors');
app.use(cors());

const Web3=require('web3');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const json = require('./build/contracts/TollCoin.json');
const abi = json['abi'];

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
}

const contractAdd="0x84b814778c912c23Dc4EEeCc54bc477299a660d6";
var contract= new web3.eth.Contract(abi,contractAdd);
console.log('Server started in http://localhost:3000 in browser');

var deployerAddress
web3.eth.getAccounts().then(function(e){
    deployerAddress=e[0]; 
	console.log('Owner (deployer) Address: ' +deployerAddress)
}).catch(e=>console.log(e));



//New Contractor
app.post('/contReg',async function(req,res,next){
    var contAdd=req.body.contractorAdd;
    var contName=req.body.contractorName;
    console.log(contAdd+" "+contName);
    try{
        await contract.methods.newContractor(contAdd,contName).send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Registered contractor: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,address:contAdd,hash:value.transactionHash});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;        
            console.log(reason);
            console.log(e); // prints "This is error message"
            res.status(404).json({ success: false, error: reason });
        });
    }
    catch(err){
        res.status(404).json({ success: false, error: err.message });
        console.log(err.message);
    }
});

//New User
app.post('/userReg',async function(req,res,next){
    var uAdd=req.body.userAdd;
    var vNum=req.body.vehicleNum;
    var rfid=req.body.rfid;
    var name=req.body.uName;
    try{
        await contract.methods.newUser(uAdd,vNum,rfid,name).send({ from: deployerAddress, gas: 300000 ,value:0}).then(function(value){
            console.log('Registered user: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,address:uAdd,hash:value.transactionHash});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;        
            console.log(reason); // prints "This is error message"
            res.status(404).json({ success: false, error: reason });
        });
    }
    catch(err){
        res.status(404).json({ success: false, error: err.message });
        console.log(err.message);
    }
});
/*app.post('/userReg', async function (req, res, next) {
	var userAddress = req.body.add1
  var vehNum = req.body.vnum
  try {
    await contract.methods.registerUser(userAddress, vehNum).send({ from: deployerAddress, gas: 150000 }).then(function (value) {
      console.log('Registered user: ' + value.transactionHash);
      console.log(value);
      res.send("The user:" + userAddress + " has been registered! Transaction Hash: " + value.transactionHash);
    });
  } catch (err) {
    await res.send(err.d);
    console.log(err.message);
  }
});*/

//User Profile
app.get('/userProfile',async function(req,res){
    var userAd=req.body.userAdd;
    try{
        await contract.methods.getUserProfile(userAd).call().then(function(value){
            console.log(value);
            console.log("User Details:\n User Name:"+value[0]+"Vehicle Num:"+value[1]+"Balance:"+value[2]);
            res.status(200).json({userName:value[0],vehicleNum:value[1],balance:value[2]});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;        
            console.log(reason); // prints "This is error message"
            res.status(404).json({ success: false, error: reason });
        });
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
});
//Contractor Profile
app.get('/contProfile',async function(req,res){
    var contAd=req.body.contAdd;
    try{
        await contract.methods.getContractorProfile(contAd).call().then(function(value){
            console.log("Contractor details:\n Contractor Name:"+value[0]+"Balance:"+value[1]);
            return res.status(200).json({contName:value[0],balance:value[1]});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;        
            console.log(reason);
            console.log(e.message); // prints "This is error message"
            res.status(404).json({ success: false, error: reason });
        });
    }
    catch(err){
        return res.status(404).json({success:false,message:err.message});
    }
});

//Pay Toll
app.post('/rfid',async function(req,res){
    console.log("hi");
    var rfidCode=req.body.uid;
    var contAdd=req.body.contAdd;
    var amount=req.body.amount;
    var etherValue=0;
    console.log(req.body);
    console.log("Someone accessed");
    console.log("UID"+rfidCode);
    try{
       await contract.methods.rfidUserId(rfidCode).call().then(async function(value){
            await contract.methods.payToll(contAdd,value,amount).send({ from: value, gas: 300000, value: etherValue }).then(function(value){
                return res.status(200).json({success:true,message:"Access granted",transactionHash:value.transactionHash});
            }).catch(e=>{
                const data = e.data;
                const txHash = Object.keys(data)[0]; // TODO improve
                const reason = data[txHash].reason;        
                console.log(e); // prints "This is error message"
                res.status(404).json({ success: false, error: reason });
            });
       })
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
});

//Buy Tokens
app.post('/buy',async function(req,res){
    var userAd=req.body.userAdd;
    var reqTokens=req.body.token;
    var etherValue = (reqTokens * 0.01);
    await contract.methods.buyTokens(userAd,reqTokens).send({ from: userAd, gas: 150000, value: web3.utils.toWei(etherValue.toString(), 'ether') }).then(function(value){
        console.log('Token Purchase: ' + value.transactionHash);
        res.status(200).json({success:true,userAd:userAd,tokens:reqTokens,hash: value.transactionHash});
    }).catch(e=>{
        const data = e.data;
        const txHash = Object.keys(data)[0]; // TODO improve
        const reason = data[txHash].reason;        
        console.log(reason); // prints "This is error message"
        res.status(404).json({ success: false, error: reason });
    });
})
//Withdraw tokens
//Balance of user
app.get('/balance',async function(req,res){
    var userAd=req.body.userAdd;
    console.log(userAd);
    try{
        await contract.methods.checkBal(userAd).call().then(function(value){
            res.status(200).json({balance:value});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;        
            console.log(e); // prints "This is error message"
            res.status(404).json({ success: false, error: reason });
        });
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
})


app.get('/transactions',async function(req,res){
    try{
        await contract.methods.getTransactionList().call().then(function(value){
            res.status(200).json({transactions:value});
        }).catch(e=>{
            const data = e.data;
            const txHash = Object.keys(data)[0];
            const reason = data[txHash].reason;        
            console.log(e);
            res.status(404).json({ success: false, error: reason });
        });

    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }

});

app.get('/',function(req,res){
    res.send("Success");
});
//Getting rfid num
/*
app.post('/rfid',function(req,res,next){
    var rfidCode=req.body.uid;
    console.log(req.body);
    console.log("Someone accessed");
    console.log("UID"+rfidCode);
    if(rfidCode=="23024824484"){
        res.status(200).json({success:true,message:"Access granted"});
    }
    else{
        res.status(401).json({success:false,message:"Access denied"});
    }
});*/

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}
catch(e){
    console.log(e);
}