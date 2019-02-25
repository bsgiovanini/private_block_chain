/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require("level");
const chainDB = "./chaindata";
const Block = require("./Block.js");

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    let self = this; // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          if (err.type == "NotFoundError") {
            console.log("Block " + key + " not found", err);
            resolve(undefined);
          } else {
            console.log("Block " + key + " get failed", err);
            reject(err);
          }
        } else {
          resolve(value);
        }
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
        if (err) {
          console.log("Block " + key + " submission failed", err);
          reject(err);
        }
        //console.log("Block " + key + " submission success", value);
        resolve(value);
      });
    });
  }

  // Method that return the height
  getBlocksCount() {
    let resolveFunction = null;
    let greatest = -1;
    this.db
      .createKeyStream()
      .on("data", function(data) {
        var nData = Number(data);
        if (nData > greatest) greatest = nData;
      })
      .on("close", function() {
        resolveFunction(greatest);
      });
    return new Promise(function(resolve, reject) {
      resolveFunction = resolve;
    });
  }
}

class Chain {
  constructor() {
    this.db = new LevelSandbox();
  }

  get(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.getLevelDBData(key).then(function(value) {
        resolve(Object.assign(new Block.Block(), JSON.parse(value)));
      });
    });
  }

  push(key, value) {
    return this.db.addLevelDBData(key, JSON.stringify(value).toString());
  }

  length() {
    return this.db.getBlocksCount();
  }
}

module.exports.Chain = Chain;
