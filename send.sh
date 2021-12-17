#!/bin/bash

export WEB3_RPC_URL=https://rinkeby.infura.io/v3/9cbb7dfbf46948fda049d01d22348b8b
export WEB3_PRIVATE_KEY=$1
web3 transfer $3 to $2