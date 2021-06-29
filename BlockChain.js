const SHA256 = require("crypto-js/sha256");
const LevelSandbox = require("./LevelSandbox.js");
const Block = require("./Block.js");

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain {
  constructor() {
    this.db = new LevelSandbox.LevelSandbox();
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    // Add your code here
    this.addBlock(new Block.Block("First block in the chain - Genesis block"));
  }

  // Add new block
  async addBlock(newBlock) {
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    await this.getBlockHeight().then(async (height) => {
      newBlock.height = height;
      console.log("Block height is " + newBlock.height);
      if (newBlock.height > 0) {
        await this.getBlock(height - 1).then((prevBlock) => {
          var data = JSON.parse(prevBlock);
          console.log("Previous block is ");
          console.log(data);
          newBlock.previousBlockHash = data.hash;
        });
      }
      console.log(height);
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      console.log(JSON.stringify(newBlock));
    });
    console.log("The height of the block is " + newBlock.height);
    return this.db.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
  }

  // Get block height
  getBlockHeight() {
    return this.db.getBlocksCount();
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return this.db.getLevelDBData(blockHeight);
  }

  // validate block
  async validateBlock(blockHeight) {
    var isValid = false;
    var isErr = false;

    // get block object
    await this.getBlock(blockHeight)
      .then((object) => {
        let block = JSON.parse(object);
        console.log("Block is ");
        console.log(block);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = "";
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
          isValid = true;
        } else {
          console.log(
            "Block #" +
              blockHeight +
              " invalid hash:\n" +
              blockHash +
              "<>" +
              validBlockHash
          );
          isValid = false;
        }
      })
      .catch((err) => {
        console.log(err);
        isErr = true;
      });

    return new Promise(function (resolve, reject) {
      if (isErr) {
        console.log("Error occurred!");
        reject(isErr);
      } else {
        resolve(isValid);
      }
    });
  }

  // Validate blockchain
  async validateChain() {
    var errorLog = [];
    await this.getBlockHeight().then(async (height) => {
      for (var i = 0; i < height - 1; i++) {
        // validate block
        await this.validateBlock(i).then((valid) => {
          if(!valid) errorLog.push(i);
        });
        // compare blocks hash link
        let blockHash;
        let previousHash;

        await this.getBlock(i).then((obj) => {
          let block = JSON.parse(obj);
          blockHash = block.hash;
        });

        await this.getBlock(i + 1).then((obj) => {
          let block = JSON.parse(obj);
          previousHash = block.previousBlockHash;
        });

        if (blockHash !== previousHash) {
          console.log('index is ' + i);
          console.log('blockhash is ' + blockHash + ' and previousHash is ' + previousHash);
          errorLog.push(i);
        }
      }
    });
    return new Promise(function (resolve, reject) {
      resolve(errorLog);
    });
  }

  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db
        .addLevelDBData(height, JSON.stringify(block))
        .then((blockModified) => {
          resolve(blockModified);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports.Blockchain = Blockchain;
