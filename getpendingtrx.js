const config = require("config");
const Web3 = require('web3');
const fs = require('fs');
const cake = require("./cake");
//const web3 = new Web3('http://47.253.41.52:8545');
const web3 = new Web3('http://127.0.0.1:8545'); 
const Common = require('ethereumjs-common').default;
const Tx = require('ethereumjs-tx').Transaction;
var options = {
  reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false
  }
};
//WS://47.253.41.52:8546
web3Ws = new Web3(new Web3.providers.WebsocketProvider('WS://47.253.41.52:8546', options));
//web3Ws = new Web3(new Web3.providers.WebsocketProvider('WS://127.0.0.1:8546'));
const pancakeAccount = '0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase();
global.sleep = async (timeout) => {
  return new Promise((res, rej) =>
    setTimeout(() => {
      return res();
    }, timeout)
  );
};

// Create an async function so I can use the "await" keyword to wait for things to finish

class bsc{
  constructor() {
    this.count = 0;
    this.nonce = 0;
  }
  async getpendingtrx(){
    this.nonce = await cake.getnonce();
    const subscription = web3Ws.eth.subscribe('pendingTransactions', (err, res) => {
      if (err) console.error(err)
    });
    subscription.on('data', (txHash) => {
      setTimeout(async () => {
        try{  
            //console.log(txHash);   
            let tx = await web3Ws.eth.getTransaction(txHash);

            if (tx && tx.to) { // This is the point you might be looking for to filter the address
              if (tx.to.toLowerCase() === pancakeAccount) {
                let re = new RegExp("0x7ff36ab5");
                if(re.test(tx.input)){
                  //console.log('TX input: ',tx.input); // the data sent along with the transaction.

                  let res=web3.eth.abi.decodeParameters([{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],
                  tx.input.replace("0x7ff36ab5",""));
                  //console.log(res);
                  console.log('TX hash: ',txHash ); // transaction hash
                  console.log('TX amount(in Ether): ',web3.utils.fromWei(tx.value, 'ether'));
                  console.log('TX amountOutMin: ',res.amountOutMin);
                  console.log('TX path: ',res.path);
                  console.log('TX deadline:: ',res.deadline);
                  console.log('TX gas price: ',tx.gasPrice );
                  if(web3.utils.fromWei(tx.value, 'ether') > 2){
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('TX hash: ',txHash ); // transaction hash
                    let gasPrice = tx.gasPrice*1.2;
                    await cake.wbnbtotoken(this.nonce,'0.00008','0',res.path[0],res.path[1],gasPrice,res.deadline);
                    this.nonce++;
                    console.log(this.nonce);
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    await sleep(100000);
                  }
                  // console.log('TX hash: ',txHash ); // transaction hash
                  // console.log('TX confirmation: ',tx.transactionIndex ); // "null" when transaction is pending
                  // console.log('TX nonce: ',tx.nonce ); // number of transactions made by the sender prior to this one
                  // console.log('TX block hash: ',tx.blockHash ); // hash of the block where this transaction was in. "null" when transaction is pending
                  // console.log('TX block number: ',tx.blockNumber ); // number of the block where this transaction was in. "null" when transaction is pending
                  // console.log('TX sender address: ',tx.from ); // address of the sender
                  // console.log('TX amount(in Ether): ',web3.utils.fromWei(tx.value, 'ether')); // value transferred in ether
                  // console.log('TX date: ',new Date()); // transaction date
                  // console.log('TX gas price: ',tx.gasPrice ); // gas price provided by the sender in wei
                  // console.log('TX gas: ',tx.gas ); // gas provided by the sender.
                  // console.log('TX input: ',tx.input); // the data sent along with the transaction.
                  console.log('====================================='); // a visual separator
                }

              }
            }
        }
        catch (err) {
                console.error(err);
        }
    }, 1000)
    });
  }  


  async decoder(){
    let res=web3.eth.abi.decodeParameters([{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],
     "00000000000000000000000000000000000000000000044d5f5d5ddcc7867399000000000000000000000000000000000000000000000000000000000000008000000000000000000000000071a1609948c441545999850a0673ea7d95f2bb8000000000000000000000000000000000000000000000000000000000622c10280000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c000000000000000000000000487ecd4cfa635d1a9409e86cd22d33d5abeb7b44");
    return res;
  }
}

let bschain = new bsc();
module.exports = bschain;
//bschain.swapTokensForTokens('0.000006').then(console.log);
bschain.getpendingtrx().then(console.log);
//bschain.decoder().then(console.log);