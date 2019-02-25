/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.data = data;
    this.height = -1;
    this.previousHash = "0x";
    this.timeStamp = 0;
  }
}

module.exports.Block = Block;
