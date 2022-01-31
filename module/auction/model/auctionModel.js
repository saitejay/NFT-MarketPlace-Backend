/*
Project : NFT-marketplace
FileName : auctionModel.js
*/

const { sign } = require('jsonwebtoken');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema
var auctionSchema = mongoose.Schema({

    auction_id:{
        type: Number,
        unique:[true, 'Auction_id already exists. Please try a different auction_id'],
        required: [true, 'Auction_id is required']
    },
    collection_id:{
        type: Number,
        required: [true, 'Collection_id is required']
    },
    item_id:{
        type: Number,
        required: [true, 'Item_id is required']
    },
    token_id: {
        type: Number,
        required: [ true , 'Token_id is required'], 
    },
    collection_address: {
        type: String,
        required: [ true , 'Collection_address is required'], 
    },
    auction_owner_address: {
        type: String,
        required: [ true , 'Auction_owner_address is required'], 
    },
    highest_bid_id: {
        type: Number,
        default:0
    },
    highest_bid_amount:{
        type:Number,
        default:0
    },
    auction_start_time: {
        type: Date,
        required: [true, 'Auction_start_time is required']
    },
    auction_end_time: {
        type: Date,
        required: [true, 'Auction_end_time is required']
    },
    number_of_bids: {
        type: Number,
        default:0
    },
    nft_creator:  {
        type: String,
        required: [true, 'Nft_creator is required']
    },
    is_auction_live: {
        type: Boolean,
        default:true
    },
    item_thumb: {
        type: String,
        required: [ true , 'Item_thumb is required']
    },
    item_image: {
        type: String,
        required: [ true , 'Item_image is required']
    },
    item_name: {
        type: String,
        required: [ true , 'Item_name is required']
    },
    auction_owner_image: {
        type: String,
        required: [ true , 'Auction_owner_image is required']
    },
    auction_owner_name: {
        type: String,
        required: [ true , 'Auction_owner_name is required']
    }

});

auctionSchema.plugin(uniqueValidator);
auctionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('auction', auctionSchema,config.db.prefix+'auction');