/*
Project : NFT-marketplace
FileName :  historyModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;

var historySchema = mongoose.Schema({
    item_id: { type: Number },
    collection_id: { type: Number },
    from_address: { type: String },
    to_address: { type: String },
    transaction_hash: {
        type: String
    },
    price: {
        type:Number
    },
    history_type:{
        type: String,
        enum : ['minted','bids','transfer', 'comission', 'admin_comission']
    },
    is_valid: {
        type:Boolean,
        default:true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

historySchema.plugin(uniqueValidator);
historySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('history', historySchema,config.db.prefix+'history');