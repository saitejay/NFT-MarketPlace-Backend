#!/bin/bash

export WEB3_RPC_URL=https://rinkeby.infura.io/v3/9cbb7dfbf46948fda049d01d22348b8b
export WEB3_PRIVATE_KEY=$4
export WEB3_ADDRESS=$2

web3 contract call --wait --abi $3 --gas-limit 2000000 --function mint $1