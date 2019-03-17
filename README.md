# Project 4: Build a Private Blockchain Notary Service

Project created as an assignment for Udacity BlockChain Developer Nanodegree Program - Project 4.
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

Install nodemon global module

```
npm install -g nodemon
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

## Blockchain ID validation routine

### Web API POST endpoint to validate request with JSON response

To validate the request, access it via the POST method (using Postman or Curl), specifying a text as a raw payload. If payload is not informed, a message of "Invalid Input" will be returned from the POST request. Use the URL for the endpoint:

```
http://localhost:8000/requestValidation
```

Example of a valid request payload:

```
{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
```

### Web API POST endpoint validates message signature with JSON response

To validate the signature, access it via the POST method (using Postman or Curl), specifying a text as a raw payload. If payload is not informed, a message of "Invalid Input" will be returned from the POST request. Use the URL for the endpoint:

```
http://localhost:8000/message-signature/validate
```

Example of a valid request payload:

```
{
   "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
   "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}
```

## Star registration Endpoint

### Submiting a new Block to the chain (POST)

After validation It is possible to post a block. Access it via the POST method (using Postman or Curl), specifying a text as a raw payload. If payload is not informed or its address was not validated, an error message will be returned from the POST request

```
http://localhost:8000/block/
```

Valid payload example

```
{
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}

```

## Star Lookup

### Get Star block by hash with JSON response

Use the URL:

```
http://localhost:8000/stars/hash:{HASH}
```

Example:

```
http://localhost:8000/stars/hash:4639e23e3027a287a3512d6c86bb43191634d8083c1ae2e458fc45dd3987feac
```

### Get Star block by wallet address (blockchain identity) with JSON response

Use the URL:

```
http://localhost:8000/stars/address:{ADDRESS}
```

Example:

```
http://localhost:8000/stars/address:1J2vezczmV3U7rdzG9XdmQjfzUFpWg6zfJ
```

### Get star block by star block height with JSON response

To get a specific block, access it via the GET method

```
http://localhost:8000/block/{height}
```

Example

```
http://localhost:8000/block/3
```
