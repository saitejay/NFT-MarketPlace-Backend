/*
Project : NFT-marketplace
FileName : collectionController.js
*/
var validator = require('validator');
const { validationResult } = require('express-validator');
var cp = require('child_process');
var Web3 = require('web3');
const config = require('../../../helper/config');
var fs = require('fs');
const auctionModel = require('../model/auctionModel');
const bidModel = require('../model/bidModel');
const dutchModel = require('../model/dutchModel');
const items = require('./../../item/model/itemModel');
const userModel = require('../../user/model/userModel');
const historyModel = require('../../item/model/historyModel');
const prices = require('../../item/model/priceModel');
const collections = require('../../collection/model/collectionModel');


/*
* This is the function which used to add auction in database
*/
exports.test = function(req, res) {
    res.send("working");
}

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
    var auction = new auctionModel();
    auction.auction_id = req.body.auction_id;
    auction.auction_owner_address = req.decoded.public_key;
    auction.auction_start_time = req.body.auction_start_time;
    auction.auction_end_time = req.body.auction_end_time;
    auction.item_id = req.body.item_id;
    auction.minimum_bid_amount = req.body.minimum_bid_amount;
    items.findOne({item_id: req.body.item_id, current_owner: req.decoded.public_key, is_on_auction:false}, function(err, itemObj){
        if (err) {
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        } else if (!itemObj) {
            res.status(404).json({
                status: false,
                message: "Item not found.",
                errors:err
            });
        } else {
            auction.token_id = itemObj.token_id;
            auction.collection_address = itemObj.collection_address;
            auction.collection_id = itemObj.collection_id;
            auction.nft_creator = itemObj.creator_address;
            auction.item_thumb = itemObj.thumb;
            auction.item_image = itemObj.media;
            auction.item_name = itemObj.name;
            auction.auction_owner_image = itemObj.owner_image;
            auction.auction_owner_name = itemObj.current_owner_name;
            auction.save(function (err ,auctionObj) {
                if (err) {
                    res.status(401).json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                    return;
                }
                itemObj.status = "active";
                itemObj.is_on_auction = true;
                itemObj.auction_id = req.body.auction_id;
                itemObj.save(function (err, item) {
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
                        message: "Auction created successfully",
                        result: auctionObj
                    });
                })
            });
        }
    });
}

exports.auctionLiveList = function(req,res) {
    auctionModel.findOne({is_auction_live: true }, function(err, auctionObj){
        if(err){
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
        } else if (!auctionObj) {
            res.status(404).json({
                status: false,
                message: "Auction not found"
            });
        }
        else{
            res.status(200).json({
                status: true,
                result: auctionObj
            });
        }
    });
}

exports.details = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    auctionModel.findOne({auction_id: req.query.auction_id}, function(err, auctionObj){
        if(err){
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
        } else if (!auctionObj) {
            res.status(404).json({
                status: false,
                message: "Auction not found"
            });
        }else{
            res.status(200).json({
                status: true,
                result: auctionObj
            });
        }
    })
}
//List all the auctions
exports.ListAllAuctions = function(req,res) {
    auctionModel.find(function(err, auctionObj){
        if(err){
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
        } else if (!auctionObj) {
            res.status(404).json({
                status: false,
                message: "Auction not found"
            });
        }
        else{
            res.status(200).json({
                status: true,
                result: auctionObj
            });
        }
    });
}

//placing a bid in auction
exports.placeBid = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    bidModel.findOne({auction_id: req.body.auction_id, bid_owner_address: req.decoded.public_key}, function(err, bidObj){
        // console.log(bidObj);
        if (err) {
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        } else if(!bidObj) {
            var bid = new bidModel();
            auctionModel.findOne({auction_id: req.body.auction_id, is_auction_live: true, auction_owner_address : { $ne: req.decoded.public_key } }, function(err, auctionObj){
                if (err) {
                    res.status(401).json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                    return;
                }else if(!auctionObj){
                    res.status(404).json({
                        status: false,
                        message: "Auction not found"
                    });
                }else{
                    if (auctionObj.minimum_bid_amount > req.body.bid_amount) {
                        res.status(401).json({
                            status: false,
                            message: "Please make bid of at least minimum bid amount."
                        });
                    } else {
                        userModel.findOne({public_key: req.decoded.public_key, status: "active"}, function(err, userObj){
                            bid.bid_id = req.body.bid_id;
                            bid.auction_id = req.body.auction_id;
                            bid.bid_owner_address = req.decoded.public_key;
                            bid.bid_amount = req.body.bid_amount;
                            bid.bid_owner_image = userObj.profile_image;
                            bid.bid_owner_name = userObj.username;
                            bid.save(function (err ,bidObj) {
                                if (err) {
                                    res.status(401).json({
                                        status: false,
                                        message: "Request failed",
                                        errors:err
                                    });
                                    return;
                                }else{
                                    bidModel.find().sort({"bid_amount":-1}).limit(1).exec(function(err, highestBid){
                                        auctionObj.highest_bid_id = highestBid[0].bid_id;
                                        auctionObj.highest_bid_amount = highestBid[0].bid_amount;
                                        auctionObj.number_of_bids = auctionObj.number_of_bids + 1;
                                        auctionObj.save(function (err ,auctionObj1) {
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
                                                message: "Bid Placed successfully",
                                                result: bidObj
                                            });
                                        });
                                    })
                                }
                            });
                        })
                    }
                }
            })            
        } else {
            // console.log(bidObj);
            if (bidObj.bid_amount < req.body.bid_amount) {
                auctionModel.findOne({auction_id: req.body.auction_id, is_auction_live: true, auction_owner_address : { $ne: req.decoded.public_key } }, function(err, auctionObj){
                    if (err) {
                        res.status(401).json({
                            status: false,
                            message: "Request failed",
                            errors:err
                        });
                        return;
                    }else if(!auctionObj){
                        res.status(404).json({
                            status: false,
                            message: "Auction not found"
                        });
                    }else{
                        bidObj.bid_amount = req.body.bid_amount;
                        bidObj.save(function(err, bidObj){
                            if (err) {
                                res.status(401).json({
                                    status: false,
                                    message: "Request failed",
                                    errors:err
                                });
                                return;
                            } else {
                                bidModel.find().sort({"bid_amount":-1}).limit(1).exec(function(err, highestBid){
                                    if (err) {
                                        res.status(401).json({
                                            status: false,
                                            message: "Request failed",
                                            errors:err
                                        });
                                        return;
                                    }
                                    auctionObj.highest_bid_id = highestBid[0].bid_id;
                                    auctionObj.highest_bid_amount = highestBid[0].bid_amount;
                                    auctionObj.number_of_bids = auctionObj.number_of_bids + 1;
                                    auctionObj.save(function (err ,auctionObj1) {
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
                                            message: "Bid Placed successfully",
                                            result: bidObj
                                        });
                                    });
                                })
                            }
                        });
                    }                    
                })
            } else {
                res.status(401).json({
                    status: false,
                    message: "Please bid higher amount than your previous bid amount."
                });
                return;
            }
        }
    })
    
}

//List all the bids in a auction
exports.listBidsInAuction = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    bidModel.find({auction_id: req.query.auction_id}, function(err, bidObj){
        if(err){
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors:err
            });
        }else if(!bidObj || bidModel.length == 0){
            res.status(404).json({
                status: false,
                message: "Bids not found"
            });
        }else{
            res.status(200).json({
                status: true,
                result: bidObj
            });
        }
    })
}

//list the bid details using the bid_id
exports.bidDetails = function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    bidModel.find({auction_id: req.query.auction_id, bid_id: req.query.bid_id}, function(err, bidObj){
        if(err){
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors:err
            });
        }else if(!bidObj){
            res.status(404).json({
                status: false,
                message: "Bids not found"
            });
        }else{
            res.status(200).json({
                status: true,
                result: bidObj
            });
        }
    })
}

//closing a auction

exports.closingAuction = function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    auctionModel.findOne({auction_id: req.body.auction_id, auction_owner_address: req.decoded.public_key, is_auction_live: true}, function(err, auctionObj){
        if (err) {
            res.status(401).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        }else if(!auctionObj){
            res.status(404).json({
                status: false,
                message: "Auction not found"
            });
        } else{
            auctionObj.is_auction_live = false;
            auctionObj.save(function(err, auctionObj1){
                if (err) {
                    res.status(401).json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                    return;
                }
                if (auctionObj1.number_of_bids == 0) {
                    items.findOneAndUpdate({item_id: auctionObj1.item_id}, {is_on_auction: false, status: "inactive", auction_id: 0}, function (err, item) {
                        if (err) {
                            res.status(401).json({
                                status: false,
                                message: "Request failed",
                                errors:err
                            });
                            return;
                        } else if(!item){
                            res.status(404).json({
                                status: false,
                                message: "Item not found"
                            });
                            return;
                        } else {
                            res.status(200).json({
                                status: true,
                                message: "Auction closed",
                                result: auctionObj1
                            });
                        }
                    })
                } else {
                    bidModel.findOne({bid_id: auctionObj1.highest_bid_id}, function(err, bid){
                        if (err) {
                            res.status(401).json({
                                status: false,
                                message: "Request failed",
                                errors:err
                            });
                            return;
                        } else if (!bid) {
                            res.status(404).json({
                                status: false,
                                message: "Bid not found"
                            });
                            return;
                        } else {
                            bid.bid_accepted = true;
                            bid.save(function(err, bidObj){
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
                                    message: "Auction closed",
                                    result: auctionObj1
                                });
                            });
                        }
                    });
                }
            })
        }
    });
}

//payback on auction
exports.paybackOnAuction = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    // auction_id, bid_id, transaction_hash
    auctionModel.findOne({auction_id: req.body.auction_id, is_auction_live: false}, function(err, auctionObj){
        if (err) {
            res.status(400).json({
            status: false,
            message: "Request failed"
        });
        } else if(!auctionObj) {
            res.status(404).json({
                status: false,
                message: "Auction not found"
            }); 
        } else {
            bidModel.findOne({auction_id: req.body.auction_id, bid_id: req.body.bid_id, bid_accepted: true}, function(err, bidObj){
                if (err) {
                    res.status(400).json({
                    status: false,
                    message: "Request failed"
                    });
                } else if(!bidObj) {
                    res.status(404).json({
                        status: false,
                        message: "Bid not found"
                    }); 
                } else {
                    items.findOne({item_id:auctionObj.item_id, status:"active", is_on_auction: true}).exec(function (err, item) {
                        if (err) {
                            res.status(400).json({
                                status: false,
                                message: "Request failed",
                                errors:err
                            });
                            return;
                        } else if (!item) {
                            res.status(404).json({
                                status: false,
                                message: "Item not found",
                            });
                            return;
                        } else {
                            let prev_owner = item.current_owner;
                            userModel.findOne({public_key: req.decoded.public_key}, function(err, user){
                                if (err) {
                                    res.status(400).json({
                                        status: false,
                                        message: "Request failed",
                                        errors:err
                                    });
                                    return;
                                } else if (!user) {
                                    res.status(404).json({
                                        status: false,
                                        message: "User not found",
                                    });
                                    return;
                                } else {
                                    item.current_owner = req.decoded.public_key;
                                    item.owner_image = user.profile_image;
                                    item.current_owner_name = user.username;
                                    item.is_on_auction = false;
                                    item.status = "inactive";
                                    item.auction_id = 0;
                                    collections.findOne({collection_id:item.collection_id},function(err, collection){
                                        if (err) {
                                            res.status(400).json({
                                                status: false,
                                                message: "Request failed",
                                                errors:err
                                            });
                                            return;
                                        } else if (!collection) {
                                            res.status(404).json({
                                                status: false,
                                                message: "Collection not found",
                                            });
                                            return;
                                        } else {
                                            collection.volume_traded = collection.volume_traded + bidObj.bid_amount;
                                            collection.save(function (err ,collectionsaveObj) {
                                                if (err) {
                                                    res.status(400).json({
                                                        status: false,
                                                        message: "Request failed",
                                                        errors:err
                                                    });
                                                    return;
                                                }
                                                item.save(function (err ,itemObj) {
                                                    if (err) {
                                                        res.status(400).json({
                                                            status: false,
                                                            message: "Request failed",
                                                            errors:err
                                                        });
                                                        return;
                                                    }
                                                    var history = new historyModel();
                                                    history.item_id = item.item_id;
                                                    history.collection_id = item.collection_id;
                                                    history.from_address = prev_owner;
                                                    history.to_address = req.decoded.public_key
                                                    history.transaction_hash = req.body.transaction_hash
                                                    history.history_type = "transfer";
                                                    history.price = bidObj.bid_amount;
                                                    history.save(function (err ,historyObj) {
                                                        if (err) {
                                                            res.status(400).json({
                                                                status: false,
                                                                message: "Request failed",
                                                                errors:err
                                                            });
                                                            return;
                                                        }
                                                        var price = new prices();
                                                        price.item_id = item.item_id;
                                                        price.price = bidObj.bid_amount;
                                                        price.user_address = req.decoded.public_key;
                                                        price.save(function (err ,priceObj) {
                                                            if (err) {
                                                                res.status(400).json({
                                                                    status: false,
                                                                    message: "Request failed",
                                                                    errors:err
                                                                });
                                                                return;
                                                            }
                                                            res.json({
                                                                status: true,
                                                                message: "Auction completed and new owner repaid successfully",
                                                                result: itemObj
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                        }
                                    });        
                                }
                            });
                        }
                    });
                }
            });
            
        }
    })
}

//Add auction
exports.addDutch = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    var dutch = new dutchModel();
    dutch.auction_id = req.body.auction_id;
    dutch.initial_amount = req.body.initial_amount;
    dutch.price_drop_rate = req.body.price_drop_rate;
    dutch.price_drop_interval = req.body.price_drop_interval;
    dutch.auction_owner_address = req.decoded.public_key;
    auctionModel.findOne({auction_id: req.body.auction_id}, function(err, auctionObj){
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors: err
            });
            return;
        }else if(!auctionObj){
            res.status(404).json({
                status: false,
                message: "Auction not found"
            });
            return;
        }else{
            dutch.collection_id = auctionObj.collection_id;
            dutch.item_id = auctionObj.item_id;
            dutch.token_id = auctionObj.token_id;
            dutch.collection_address = auctionObj.collection_address;
            dutch.auction_start_time = auctionObj.auction_start_time;
            dutch.auction_end_time = auctionObj.auction_end_time;
            dutch.nft_creator_address = auctionObj.nft_creator;
            dutch.save(function(err, result){
                if(err){    
                    res.status(400).json({
                        status: false,
                        message: "Request failed",
                        errors: err
                    });
                    return;
                }else{
                    res.json({
                        status: true,
                        message: "Dutch created successfull",
                        data: result
                    });
                }
            })
        }
    })
}

//list Dutch_auction_details
exports.listDutchDetails = function(req, res){
    dutchModel.findOne({auction_id: req.query.auction_id}, function(err, dutchObj){
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors: err
            });
            return;
        }else if(!dutchObj){
            res.status(404).json({
                status: false,
                message: "Dutch not found"
            });
            return;
        }else{
            res.json({
                status: true,
                data: dutchObj
            });
        }
    })
}

//List all the dutch
exports.listAllDutchinfo = function(req, res){
    dutchModel.find().exec(function(err, dutchObj){
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors: err
            });
            return;
        }else if(!dutchObj){
            res.status(404).json({
                status: false,
                message: "Dutch not found"
            });
            return;
        }else{
            res.json({
                status: true,
                data: dutchObj
            });
        }
    })
}

//Accept dutch
exports.acceptDutchAuction = function(req, res){
    res.send("Accept dutch comming soon...");
}

//close dutch
exports.closeDutchAuction = function(req, res){
    res.send("Close dutch comming soon...");
}