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
      if (block && block.body && block.body.star) {
        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
      }
      return block;
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
    const hash = request.params.HASH;
    const result = Joi.validate(hash, Joi.string().required());

    if (result.error === null) {
      const block = await bc.getBlockByHash(hash);
      if (block && block.body && block.body.star) {
        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
      }
      return block;
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
    const address = request.params.ADDRESS;
    const result = Joi.validate(address, Joi.string().required());
    if (result.error === null) {
      const blocks = await bc.listBlocksByWalletAddress(address);
      return blocks.map(function(block) {
        if (block && block.body && block.body.star) {
          block.body.star.storyDecoded = hex2ascii(block.body.star.story);
        }
        return block;
      });
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
