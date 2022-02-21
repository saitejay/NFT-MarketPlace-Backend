/*
Project : NFT-marketplace
FileName : optionsModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var config = require('./../../../helper/config');
const Schema = mongoose.Schema;

// Setup schema
var optionSchema = mongoose.Schema({
    name: { 
        type: String, 
        require:[true, 'Settings name is required'] 
    },
    value: { 
        type: String, 
        default: ''
    },
});

optionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('options', optionSchema,config.db.prefix+'options');