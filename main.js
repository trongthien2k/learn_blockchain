const SHA256 = require('crypto-js/sha256')


class Transactions{
    constructor(
        fromAddress, toAddress, amount
    ){
        this.fromAddress = fromAddress,
        this.toAddress = toAddress,
        this.amount = amount
    }
}

class Block {
  constructor( timestamp,transactions, prevHash = "") {
        this.timestamp = timestamp,
        this.transactions = transactions,
        this.prevHash = prevHash,
        this.hash = this.calculateHash()
        this.mineVar = 0

  }
  calculateHash(){       
        return SHA256(this.prevHash+this.timestamp+JSON.stringify(this.data)+ this.mineVar).toString()
  }

  mineBlock(difficuty){
    while (!this.hash.startsWith("0".repeat(difficuty))) {
            this.mineVar++
            this.hash = this.calculateHash()

    }
    console.log("Block mined " + this.hash + " " + this.mineVar)

  }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficuty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }
    createGenesisBlock(){
        return new Block("28/12/2022", "Genesis Block", '0')
    }

    getLastBlock(){
        return this.chain[this.chain.length-1]
    }


    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficuty) 
        console.log("Block successfly mined!")
        this.chain.push(block)

        this.pendingTransactions=[new Transactions(null, miningRewardAddress, this.miningReward)]

    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address) {
                    balance -= trans.amount
                }

                if(trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++) {
            const currentBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false
            }

            if(currentBlock.prevHash !== prevBlock.hash){
                return false
            }
        }

        return true
    }
}


let thienCoin = new BlockChain()

thienCoin.createTransaction(new Transactions("address1", "address2", 100))
thienCoin.createTransaction(new Transactions("address2", "address1", 50))

thienCoin.minePendingTransactions("thien-address")

console.log("Số dư: ", thienCoin.getBalanceOfAddress("thien-address"))


thienCoin.minePendingTransactions("thien-address")

console.log("Số dư: ", thienCoin.getBalanceOfAddress("thien-address"))



thienCoin.minePendingTransactions("thien-address")

console.log("Số dư: ", thienCoin.getBalanceOfAddress("thien-address"))

console.log(JSON.stringify(thienCoin,null , 4))