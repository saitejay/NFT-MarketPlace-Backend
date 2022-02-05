/*
Project : NFT-marketplace
FileName : favouriteModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;

var favouriteSchema = mongoose.Schema({
    item_id: { 
        type: String, 
        // ref: 'item' 
    },
    user_address: { 
        type: String, 
        // ref: 'users' 
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

favouriteSchema.plugin(uniqueValidator);
favouriteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('favourites', favouriteSchema,config.db.prefix+'favourites');