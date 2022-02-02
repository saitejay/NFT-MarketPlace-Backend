/*
Project : NFT-marketplace
FileName : collectionController.js
*/

var collections = require('../model/collectionModel');
var items = require('../../item/model/itemModel');
var userController = require('./../../user/controller/userController');
var validator = require('validator');
const { validationResult } = require('express-validator');
var cp = require('child_process');
var Web3 = require('web3');
const config = require('../../../helper/config');
var fs = require('fs');
const { collection } = require('../model/collectionModel')
const { Console } = require('console');
const itemModel = require('../../item/model/itemModel');
/*
* This is the function which used to add collection in database
*/
exports.add = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var collection = new collections();
    collection.collection_id = req.body.collection_id;
    let name = req.body.name;
    let keyword = name.toLowerCase().split(' ').join('-');
    collection.collection_keyword = keyword;
    collection.name = name;
    collection.description = req.body.description ? req.body.description : '';
    collection.royalties = req.body.royalties ? req.body.royalties : 0;
    collection.banner = req.body.banner ? req.body.banner : '';
    collection.image = req.body.image ? req.body.image : '';
    collection.status = 1;
    collection.author_address = req.decoded.public_key;
    collection.collection_address = req.body.collection_address;
    collection.contract_symbol = req.body.token_symbol;
    collection.save(function (err ,collectionObj) {
        if (err) {
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Collection created successfully",
            result: collectionObj
        });
    });
}

/*
* This is the function which used to update collection in database
*/
exports.update = function(req,res) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    collections.findOne({collection_keyword:req.body.collection_keyword, author_address: req.decoded.public_key}, function (err, collection) {
        if (err) {
            res.status(400).json({  
                status: false,
                message: "Request failed",
                errors:err
            });
            // return;
        }
        else if (!collection) {
            res.status(404).json({  
                status: false,
                message: "Collection not found",
                errors:err
            }); 
        } 
        else {
            collection.name = req.body.name? req.body.name: collection.name;
            collection.description = req.body.description ? req.body.description : collection.description;
            collection.image = req.body.image ?  req.body.image : collection.image;
            collection.banner = req.body.banner ? req.body.banner : collection.banner;
            collection.royalties = req.body.royalties ? req.body.royalties : collection.royalties;
            collection.save(function (err , collection) {
                if (err) {
                    res.status(400).json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                    return;
                } else {
                    res.status(200).json({
                        status: true,
                        message: "Collection updated successfully",
                        result: collection 
                    });  
                }
            });
        }
    });
}

/*
* This is the function which used to delete collection in database
*/
exports.delete = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    collections.findOne({collection_keyword:req.body.collection_keyword, author_address:req.decoded.public_key}, function (err, collection) {
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            // return;
        }
        else if (!collection) {
            res.status(404).json({  
                status: false,
                message: "Collection not found",
                errors:err
            }); 
        } 
        else{
            items.countDocuments({collection_keyword: req.body.collection_keyword},function(err,count) {
                if (err) {
                    res.status(400).json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                } else if(count != 0) {
                    items.deleteMany({collection_keyword: req.body.collection_keyword}, function(err, deleteCount) {
                        if (err) {
                            res.status(400).json({
                                status: false,
                                message: "Request failed",
                                errors:err
                            });
                        } else {
                            collections.deleteOne({collection_keyword:req.body.collection_keyword}, function(err) {
                                if (err) {
                                    res.status(400).json({
                                        status: false,
                                        message: "Request failed",
                                        errors:err
                                    }); 
                                } else {
                                    res.json({
                                        status: true,
                                        message: "Collection deleted successfully"
                                    }); 
                                }
                            })
                        }
                    });
                    
                } else {
                    collections.deleteOne({collection_keyword:req.body.collection_keyword},function(err) {
                        if (err) {
                            res.status(400).json({
                                status: false,
                                message: "Request failed",
                                errors:err
                            }); 
                        } else {
                            res.json({
                                status: true,
                                message: "Collection deleted successfully"
                            }); 
                        } 
                    }); 
                }
            })
        }
    });
}

/**
 *  This is the function which used to view collection
 */
exports.view = function(req,res) {
    collections.findOne({collection_keyword:req.query.collection_keyword}).exec( function (err, collection) {
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors:"Database failure"
            });
            return;
        }
        if(!collection) {
            res.status(404).json({
                status: false,
                message: "Request failed",
                errors:"Collection not found"
            });
            return;
        } 
        res.status(200).json({
            status: true,
            message: "Collection info retrieved successfully",
            result: collection
        });
    })
}

/**
 * This is the function which used to list collection with filters
 */
exports.list = function(req,res) {
    var keyword = req.query.keyword ? req.query.keyword : ''; 
    keyword = keyword.replace("+"," ");     
    var page = req.query.page ? req.query.page : '1';  
    var query  = collections.find();
    var offset = ( page == '1' ) ? 0 : ((parseInt(page-1))*10);
    if ( keyword != '' ) {
        search = { $or: [ { 
            name :   {
                $regex: new RegExp(keyword, "ig")
        }  } , {
            description : {
                $regex : new RegExp ( keyword , "ig")
            }
        }] }
       query = query.or(search)
    }    
    if(req.query.type == "my") {
        if(req.decoded.public_key != null) {
            query = query.where('author_address',req.decoded.public_key).sort('-create_date');
        }
    } else if(req.query.type == "item") {
        if(req.decoded.public_key != null) {
            query = query.sort('-item_count');
        }
    } else {
        query = query.where('status' , 1).sort('-create_date')
    }

    var options = {
    select:   'name description banner image royalties item_count collection_id collection_keyword author_address collection_address contract_symbol',
    page:page,
    offset:offset,
    limit:10,    
    };  
    collections.paginate(query, options).then(function (result) {
        if(!result.docs[0]) {
            res.status(404).send({
                status: false,
                message: "No collections available"
            });
        }
        else {
            res.status(200).json({
                status: true,
                message: "Collection retrieved successfully",
                data: result
            });
        }
    }); 
}


/**
 * This is the function which used to list all items for admin
 */
exports.getAdminList = function(req,res) {
    var keyword = req.query.keyword ? req.query.keyword : ''; 
    keyword = keyword.replace("+"," ");     
    var page = req.query.page ? req.query.page : '1';  
    var query  = collections.find();
    var offset = ( page == '1' ) ? 0 : ((parseInt(page-1))*10);
    if ( keyword != '' ) {
        search = { $or: [ { 
            name :   {
                $regex: new RegExp(keyword, "ig")
        }  } , {
            description : {
                $regex : new RegExp ( keyword , "ig")
            }
        }] }
       query = query.or(search)
    }    
    query = query.sort('-create_date')
    var options = {
    select:   'name description banner image royalties',
    page:page,
    offset:offset,
    limit:10,    
    };  
    collections.paginate(query, options).then(function (result) {
        res.json({
            status: true,
            message: "Collection retrieved successfully",
            data: result
        });
    });
}





