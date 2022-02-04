/*
Project : NFT-marketplace
FileName : collectionController.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema
var collectionSchema = mongoose.Schema({

    collection_id:{
        type: Number,
        unique:[true, 'Collection_id already exists. Please try a different collection_id'],
        required: [true, 'Collection_id is required']
    },
    collection_keyword:{
        type: String,
        unique:[true, 'collection_keyword already exists. Please try a different collection_keyword'],
        required: [true, 'collection_keyword is required']
    },
    name: {
        type: String,
        minlength: [3, 'Name must be 3 characters or more'],
        maxlength: [255, "Name can't exceed 255 characters"],
        unique: [ true , 'Name already exists. Please try a different name'],
        required: [ true , 'Name is required'], 
    },
    description: {
        type: String,
        maxlength: [1000, "Description can't exceed 1000 characters"]
    },
    contract_symbol:{
        type:String,
        unique: [ true, 'contract_symbol already exists. Please try a different contract_symbol'],
        required: [true, 'contract_symbol is required']
    },
    collection_address: {
        type: String,
        unique: [ true, 'collection_address already exists. Please try a different collection_address'],
        required: [true, 'collection_address is required']
    },
    banner: {
        type: String,
    },
    image: {
        type: String,
    },
    royalties:{
        type: Number,
        default:0
    },
    volume_traded:{
        type: Number,
        default:0
    },
    item_count:{
        type: Number,
        default:0
    },
    status:{
        type: Number,
        enum : [0,1],
        default: 1
    },
    author_address: { 
        type: String, 
        required:[true, 'Author_address is required'] 
    },
    creator_name: {
        type: String,
        required: [true, 'Creator_name is required']
    },
    creator_image: {
        type: String,
        required: [true, 'Create_image is required']
    },
    create_date: {
        type: Date,
        default: Date.now
    },
});

collectionSchema.plugin(uniqueValidator);
collectionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('collection', collectionSchema,config.db.prefix+'collection');