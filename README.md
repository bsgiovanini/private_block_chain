# Project 3: Connect Private Blockchain to Front-End Client via APIs

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

### Accessing an existing block in the chain (GET)

To get a specific block, access it via the GET method

```
http://localhost:8000/block/{height}
```

Example

```
http://localhost:8000/block/3
```

### Web API POST endpoint to validate request with JSON response

Use the URL for the endpoint:

```
http://localhost:8000/requestValidation
```

Example of a valid request payload:

```
{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
```

### Web API POST endpoint validates message signature with JSON response

Use the URL for the endpoint:

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

### And submiting a new Block to the chain (POST)

To post a specific block, access it via the POST method (using Postman or Curl), specifying a text as a raw payload. If payload is not informed, a message of "Invalid Input" will be returned from the POST request

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
