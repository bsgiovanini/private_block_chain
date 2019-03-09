const BC = require("./BlockChain.js");
const B = require("./Block.js");

module.exports = theLoop;

async function theLoop(i, bc) {
  setTimeout(async function() {
    //Test Object
    let result = await bc.addBlock(new B.Block(`teste ${i}`));
    if (!result) {
      console.log("Error Adding data");
    } else {
      console.log(result);
    }
    i++;
    if (i < 10) {
      await theLoop(i, bc);
    } else {
      let isValid = await bc.validateChain();

      console.log(`validation is: ${isValid}`);
      /*const mblock = new B.Block(`teste 40`);
      bc._modifyBlock(4, mblock).then(function(m) {
        bc.validateChain().then(isValid2 => {
          console.log(`validation is: ${isValid2}`);
        });
      });*/
    }
  }, 100);
}
