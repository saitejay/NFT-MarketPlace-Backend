/*
Project : Cryptotrades
FileName : item.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to define all route releated to collecion api request.
*/

var express = require('express')
var router = express.Router();
var auth = require("./../../../middleware/auth");
var adminauth = require("./../../../middleware/adminauth");
var optionalauth = require("./../../../middleware/optionalauth");
var auctionController = require("./../controller/auctionController");
const { check } = require('express-validator');

router.get('/',auctionController.test)
router.post('/add', [check('auction_id').not().isEmpty(), check('item_id').not().isEmpty(), check('auction_start_time').not().isEmpty(), check('auction_end_time').not().isEmpty(), auth], auctionController.add)
router.get('/livelist', auctionController.auctionLiveList)
router.get('/details', auctionController.details)
router.get('/listall', auctionController.ListAllAuctions)
router.post('/placebid',[check('bid_id').not().isEmpty(), check('auction_id').not().isEmpty(), check('bid_amount').not().isEmpty(), auth], auctionController.placeBid)
router.get('/bidsinauction', auctionController.listBidsInAuction)
router.get('/biddetails', [check('auction_id').not().isEmpty(), check('bid_id').not().isEmpty(), optionalauth], auctionController.bidDetails)
router.post('/closeauction',[check('auction_id').not().isEmpty(), auth], auctionController.closingAuction)
router.post('/paybackauction',[check('auction_id').not().isEmpty(),check('bid_id').not().isEmpty(),check('transaction_hash').not().isEmpty(), auth], auctionController.paybackOnAuction)


module.exports = router