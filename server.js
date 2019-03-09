"use strict";

const Hapi = require("hapi");
const init = require("./app");
const Joi = require("joi");

const BC = require("./BlockChain.js");
const B = require("./Block.js");

let bc = new BC.Blockchain();

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
      return block;
    } else {
      return "Input Validation Error";
    }
  }
});
server.route({
  method: "POST",
  path: "/block",
  handler: async function(request, h) {
    const content = request.payload;
    const result = Joi.validate(content, Joi.string().required());
    if (result.error === null) {
      const newBlock = new B.Block(content);
      const created = await bc.addBlock(newBlock);
      return created;
    } else {
      return "Input Validation Error";
    }
  }
});

// Start the server
const start = async function() {
  try {
    await init(0, bc);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
