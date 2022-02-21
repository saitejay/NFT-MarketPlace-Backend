/*
Project : NFT-marketplace
FileName :  priceModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;

var priceSchema = mongoose.Schema({
    item_id: { type: Number },
    price: {
        type: Number,
        default:0
    },
    user_address: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

priceSchema.plugin(uniqueValidator);
priceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('prices', priceSchema,config.db.prefix+'prices');