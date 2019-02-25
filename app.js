const BC = require("./BlockChain.js");
const B = require("./Block.js");

let bc = new BC.Blockchain();

(function theLoop(i) {
  setTimeout(function() {
    //Test Object
    let objAux = { id: i, data: `Data #: ${i}` };
    bc.addNewBlock(new B.Block(`teste ${i}`))
      .then(result => {
        if (!result) {
          console.log("Error Adding data");
        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.log(err);
      });
    i++;
    if (i < 10) {
      theLoop(i);
    } else {
      bc.validateChain()
        .then(isValid => {
          console.log(`validation is: ${isValid}`);
          const mblock = new B.Block(`teste 40`);
          bc._modifyBlock(4, mblock).then(function(m) {
            bc.validateChain().then(isValid2 => {
              console.log(`validation is: ${isValid2}`);
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, 100);
})(0);
