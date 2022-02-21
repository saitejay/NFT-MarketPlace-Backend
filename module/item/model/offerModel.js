/*
Project : NFT-marketplace
FileName : offerModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;

var offerSchema = mongoose.Schema({
    item_id: { type: Schema.Types.ObjectId, ref: 'item' },
    sender: { type: Schema.Types.ObjectId, ref: 'users' },
    receiver: { type: Schema.Types.ObjectId, ref: 'users' },
    price: {
        type:Number
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

offerSchema.plugin(uniqueValidator);
offerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('offer', offerSchema,config.db.prefix+'offer');