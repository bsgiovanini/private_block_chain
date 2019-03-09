# Project 3: Connect Private Blockchain to Front-End Client via APIs

Project created as an assignment for Udacity BlockChain Developer Nanodegree Program - Project 3.
RESTful API using the [Hapi.js](https://hapijs.com) Node.js framework which interfaces with the private blockchain. The package [JOI](https://github.com/hapijs/joi) was used to support input validation

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run locally, this software requires node (version 8 or above) up and running

### Installing

A step by step to get it running

Clone the project from github

```
git clone https://github.com/bsgiovanini/private_block_chain.git
```

Install all dependencies of npm

```
npm install
```

## Running

Run this command on bash and a server will start at port 8000 with 10 blocks already added to the chain.

```
npm start
```

### Accessing API methods

To get a specific block, access it via the GET method

```
http://localhost:8000/block/{height}
```

Example

```
http://localhost:8000/block/3
```

### And coding style tests

To post a specific block, access it via the POST method (using Postman or Curl), specifying a text as a raw payload. If payload is not informed, a message of "Invalid Input" will be returned from the POST request

```
http://localhost:8000/block/
```

Valid payload example

```
"Testing block with test string data"
```
