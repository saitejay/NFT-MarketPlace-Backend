/*
Project : NFT-marketplace
FileName : itemModel.js
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema

const attributeSchema = new Schema({ name: String, type:String });
const rangeSchema = new Schema({ name: String, value:Number, valueof: Number });

var itemSchema = mongoose.Schema({
    
    name: {
        type: String,
        minlength: [3, 'Name must be 3 characters or more'],
        maxlength: [255, "Name can't exceed 255 characters"],
        unique: [ true , 'Name already exists. Please try a different name'],
        required: [ true , 'Name is required'], 
    },
    item_id: {
        type: Number,
        default:0
    },
    collection_address: {
        type: String,
        required: [ true , 'Collection_address is required'], 
    },
    description: {
        type: String,
        maxlength: [1000, "Description can't exceed 1000 characters"]
    },   
    external_link: {
        type: String,
        required: [ true , 'external_link is required']
    }, 
    media: {
        type: String,
        // unique: [ true , 'Media already exists. Please try a different media'],
        required: [ true , 'Media is required'],
    },
    thumb: {
        type: String,
        // unique: [ true , 'Thumb already exists. Please try a different thumb'],
        required: [ true , 'Thumb is required'],
    },
    item_hash: {
        type: String,
        required: [ true , 'Item_hash is required'],
    },
    has_offer: {
        type: Boolean,
        default: false
    },
    attributes: [{
        type: {
            type: String
        },
        name:{
            type: String
        }
       }],
    levels: [{
        name: {
            type: String
        },
        value: {
            type: Number
        },
        valueof: {
            type: Number
        }
    }],
    stats: [{
        name: {
            type: String
        },
        value: {
            type: Number
        },
        valueof: {
            type: Number
        }
    }],
    unlock_content_url: {
        type: Boolean,
        required: [ true, 'unlock_content_url is required'],
    },
    view_count: {
        type: Number,
        default:0
    },
    like_count: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        default:0
    },
    token_id:{
        type: Number,
        default:0
    },
    category_id: { 
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [ true, 'Category_id is required'],
    },
    collection_id: {
        type: Number, 
        // ref: 'collection',
        required: [ true , 'Collection_id is required'],
    },
    collection_keyword: {
        type: String,
        // ref: 'collection',
        required: [ true , 'Collection_keyword is required'],
    },
    creator_address: { 
        type: String, 
        // ref: 'users',
        required: [ true , 'Creator_address is required'],
    },
    creator_image:{
        type:String,
        // required: [ true , 'creator_image is required']
    },
    creator_name: {
        type: String,
        required: [ true , 'creator_name is required']
    },
    current_owner: { 
        type: String, 
        // ref: 'users',
        required: [ true , 'Current_owner is required'],
    },
    owner_image:{
        type: String, 
        // ref: 'users',
        // required: [ true , 'Owner_image is required'],
    },
    current_owner_name: { 
        type: String, 
        // ref: 'users',
        required: [ true , 'Current_owner_name is required'],
    },
    status:{
        type: Boolean,
        // enum : ['active','inactive'],
        default: false
    },
    minted_date: {
        type: Date,
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    is_on_auction: {
        type: Boolean,
        default: false
    }
});

itemSchema.plugin(uniqueValidator);
itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('item', itemSchema,config.db.prefix+'item');