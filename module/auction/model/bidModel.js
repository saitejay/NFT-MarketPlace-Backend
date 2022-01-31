/*
Project : NFT-marketplace
FileName : bidModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema
var bidSchema = mongoose.Schema({
    bid_id:{
        type: Number,
        unique:[true, 'Bid_id already exists. Please try a different bid_id'],
        required: [true, 'Bid_id is required']
    },
    auction_id:{
        type: Number,
        required: [true, 'Auction_id is required']
    },
    bid_owner_address:{
        type: String,
        required: [true, 'Bid_owner_address is required']
    },
    bid_owner_name: {
        type: String,
        required: [true, 'Bid_owner_name is required']
    },
    bid_amount:{
        type: Number,
        required: [true, 'Bid_amount is required']
    },  
    bid_accepted: {
        type: Boolean,
        default: false
    },
    bid_owner_image: {
        type: String,
        // required: [true, 'Bid_owner_image is required']
    }
});

bidSchema.plugin(uniqueValidator);
bidSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('bid', bidSchema,config.db.prefix+'bid');