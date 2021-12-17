#!/bin/bash

export WEB3_RPC_URL=https://rinkeby.infura.io/v3/9cbb7dfbf46948fda049d01d22348b8b
export WEB3_PRIVATE_KEY=$6
export WEB3_ADDRESS=$4

web3 contract call --wait --abi $5 --gas-limit 2000000 --function transferFrom $1 $2 $3