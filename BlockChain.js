/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require("crypto-js/sha256");
const Chain = require("./LevelSandbox.js");
const Block = require("./Block.js");

class Blockchain {
  constructor() {
    this.chain = new Chain.Chain();
    this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  generateGenesisBlock() {
    let self = this;
    this.getBlockHeight().then(function(height) {
      if (height == -1) {
        const block = self.createGenesisBlock();
        self.addNewBlock(block);
      }
    });
  }

  createGenesisBlock() {
    return new Block.Block("First block in the chain - Genesis block");
  }

  // Get block height, it is a helper method that return the height of the blockchain
  getBlockHeight() {
    return this.chain.length();
    // Add your code here
  }

  // Add new blockƒ
  addNewBlock(newBlock) {
    let self = this;
    return this.getBlockHeight().then(function(height) {
      newBlock.height = height + 1;
      newBlock.timeStamp = new Date()
        .getTime()
        .toString()
        .slice(0, -3);

      // previous block hash

      const prevkeyNumber = height;
      return self.getBlock(prevkeyNumber).then(function(block) {
        if (block === undefined) {
          newBlock.previousHash = "0x";
        } else {
          newBlock.previousHash = block.hash;
        }

        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        return self.chain.push(newBlock.height, newBlock);
      });
    });
  }

  // Get Block By Height
  getBlock(key) {
    if (key >= 0) return this.chain.get(key);
    return Promise.resolve(undefined);
  }

  // Validate if Block is being tampered by Block Height
  validateBlock(height) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getBlock(height).then(function(block) {
        const validBlockHash = block.hash;
        // to be able to compare blocks, it must not have the field hash
        delete block.hash;
        const blockHash = SHA256(JSON.stringify(block)).toString();

        if (validBlockHash === blockHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Validate Blockchain
  validateChain() {
    let self = this;
    return this.getBlockHeight().then(function(height) {
      const promises = [];

      // blocks validation
      for (let i = 0; i < height; i++) {
        let pr = self.validateBlock(i);
        promises.push(pr);
      }

      //links validation
      promises.push(
        new Promise(function(resolve, reject) {
          let j = 0;
          const linkPromises = [];
          for (let i = 0; i < height; i++) {
            linkPromises.push(
              self.getBlock(i).then(function(prevBlock) {
                return self
                  .getBlock(prevBlock.height + 1)
                  .then(function(block) {
                    //console.log(prevBlock.height, block.height);
                    return block.previousHash === prevBlock.hash;
                  });
              })
            );
          }
          Promise.all(linkPromises).then(results => {
            const linkValidation = results.reduce(function(acc, current) {
              return acc && current;
            });
            resolve(linkValidation);
          });
        })
      );

      return Promise.all(promises).then(results => {
        const validation = results.reduce(function(acc, current) {
          return acc && current;
        });
        return validation;
      });
    });
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.chain
        .push(height, block)
        .then(blockModified => {
          resolve(blockModified);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports.Blockchain = Blockchain;
