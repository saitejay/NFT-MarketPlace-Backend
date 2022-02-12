/*
Project : Cryptotrades
FileName : dutchModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema
var dutchSchema = mongoose.Schema({

    auction_id:{
        type: Number,
        unique:[true, 'Auction_id already exists. Please try a different auction_id'],
        required: [true, 'Auction_id is required']
    },
    auction_owner_address: {
        type: String,
        required: [ true , 'Auction_owner_address is required'], 
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
    initial_amount: {
        type: Number,
        required: [ true , 'Initial_amount is required'], 
    },
    auction_start_time: {
        type: Date,
        required: [true, 'Auction_start_time is required']
    },
    auction_end_time: {
        type: Date,
        required: [true, 'Auction_end_time is required']
    },
    price_drop_rate: {
        type: Number,
        required: [true, 'Price_drop_rate is required']
    },
    price_drop_interval: {
        type: Date,
        required: [true, 'Price_drop_interval is required']
    },
    nft_creator_address:  {
        type: String,
        required: [true, 'Nft_creator_address is required']
    },
    is_auction_live: {
        type: Boolean,
        default:true
    },
    auction_accepted_amount: {
        type: Number,
        default: 0
    },
    auction_accepted_address: {
        type: String,
        default: "0x0000000000000000000000000000000000000000"
    }
});

dutchSchema.plugin(uniqueValidator);
dutchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('dutch', dutchSchema,config.db.prefix+'dutch');