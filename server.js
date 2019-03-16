"use strict";

const Hapi = require("hapi");
const init = require("./app");
const Joi = require("joi");
const hex2ascii = require("hex2ascii");

const BC = require("./BlockChain.js");
const B = require("./Block.js");
const Mempool = require("./Mempool");

let bc = new BC.Blockchain();

let mempool = new Mempool();

// Create a server with a host and port
const server = Hapi.server({
  host: "localhost",
  port: 8000
});

// Add the route
server.route({
  method: "GET",
  path: "/block/{height}",
  handler: async function(request, h) {
    const height = request.params.height;
    const maxheight = await bc.getBlockHeight();
    const result = Joi.validate(
      height,
      Joi.number()
        .min(0)
        .max(maxheight)
    );

    if (result.error === null) {
      const block = await bc.getBlock(height);
      return {
        hash:
          "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
        height: 1,
        body: {
          address: "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
          star: {
            ra: "16h 29m 1.0s",
            dec: "-26° 29' 24.9",
            story:
              "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            storyDecoded: "Found star using https://www.google.com/sky/"
          }
        },
        time: "1532296234",
        previousBlockHash:
          "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
      };
    } else {
      return h
        .response({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request parameter"
        })
        .code(400);
    }
  }
});

server.route({
  method: "GET",
  path: "/stars/hash:{HASH}",
  handler: async function(request, h) {
    const height = request.params.HASH;
    const maxheight = await bc.getBlockHeight();
    const result = Joi.validate(
      height,
      Joi.number()
        .min(0)
        .max(maxheight)
    );

    if (result.error === null) {
      const block = await bc.getBlock(height);
      return {
        hash:
          "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
        height: 1,
        body: {
          address: "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
          star: {
            ra: "16h 29m 1.0s",
            dec: "-26° 29' 24.9",
            story:
              "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            storyDecoded: "Found star using https://www.google.com/sky/"
          }
        },
        time: "1532296234",
        previousBlockHash:
          "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
      };
    } else {
      return h
        .response({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request parameter"
        })
        .code(400);
    }
  }
});

server.route({
  method: "GET",
  path: "/stars/address:{ADDRESS}",
  handler: async function(request, h) {
    const height = request.params.ADDRESS;
    const maxheight = await bc.getBlockHeight();
    const result = Joi.validate(
      height,
      Joi.number()
        .min(0)
        .max(maxheight)
    );

    if (result.error === null) {
      const block = await bc.getBlock(height);
      return [
        {
          hash:
            "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
          height: 1,
          body: {
            address: "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
            star: {
              ra: "16h 29m 1.0s",
              dec: "-26° 29' 24.9",
              story:
                "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
              storyDecoded: "Found star using https://www.google.com/sky/"
            }
          },
          time: "1532296234",
          previousBlockHash:
            "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
        },
        {
          hash:
            "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
          height: 2,
          body: {
            address: "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
            star: {
              ra: "17h 22m 13.1s",
              dec: "-27° 14' 8.2",
              story:
                "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
              storyDecoded: "Found star using https://www.google.com/sky/"
            }
          },
          time: "1532330848",
          previousBlockHash:
            "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
        }
      ];
    } else {
      return h
        .response({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request parameter"
        })
        .code(400);
    }
  }
});

server.route({
  method: "POST",
  path: "/block",
  handler: async function(request, h) {
    const content = request.payload;
    if (mempool.verifyAddressRequest(content.address)) {
      let body = {
        address: content.address,
        star: {
          ra: content.star.ra,
          dec: content.star.dec,
          //mag: content.star.mag,
          //cen: content.star.cen,
          story: Buffer(content.star.story).toString("hex")
        }
      };
      const newBlock = new B.Block(body);
      const created = await bc.addBlock(newBlock);
      const createdObj = JSON.parse(created);
      if (createdObj && createdObj.body && createdObj.body.star) {
        createdObj.body.star.storyDecoded = hex2ascii(
          createdObj.body.star.story
        );
      }
      return createdObj;
    }
  },
  options: {
    validate: {
      payload: Joi.object()
        .keys({
          address: Joi.string().required(),
          star: Joi.object()
            .keys({
              dec: Joi.string().required(), //regex validation?
              ra: Joi.string().required(),
              //mag: Joi.string().required(),
              //cen: Joi.string().required(),
              story: Joi.string().required()
            })
            .required()
        })
        .min(2)
        .max(2)
    }
  }
});

server.route({
  method: "POST",
  path: "/requestValidation",
  handler: async function(request, h) {
    const address = request.payload.address;
    return await mempool.addRequestValidation(address);
  },
  options: {
    validate: {
      payload: {
        address: Joi.string().required()
      }
    }
  }
});

server.route({
  method: "POST",
  path: "/message-signature/validate",
  handler: async function(request, h) {
    const address = request.payload.address;
    const signature = request.payload.signature;
    return await mempool.validadeRequestByWallet(address, signature);
  },
  options: {
    validate: {
      payload: {
        address: Joi.string().required(),
        signature: Joi.string().required()
      }
    }
  }
});

// Start the server
const start = async function() {
  try {
    //await init(0, bc);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
