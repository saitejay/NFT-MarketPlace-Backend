/*
Project : NFT-marketplace
FileName : viewModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;

var viewSchema = mongoose.Schema({
    item_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'item' 
    },
    user_address: { 
        type: String,
        //  ref: 'users' 
        },
    created_date: {
        type: Date,
        default: Date.now
    },
});

viewSchema.plugin(uniqueValidator);
viewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('views', viewSchema,config.db.prefix+'views');