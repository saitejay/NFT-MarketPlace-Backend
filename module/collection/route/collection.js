/*
Project : NFT-marketplace
FileName : collection.js
*/

var express = require("express");
const multer = require("multer");
var router = express.Router();
var collectionController = require("./../controller/collectionController");
var auth = require("./../../../middleware/auth");
var adminauth = require("./../../../middleware/adminauth");
var optionalauth = require("./../../../middleware/optionalauth");
const { check } = require("express-validator");
const upload = multer();

router.post(
  "/add",
  [
    check("name").not().isEmpty(),
    upload.fields([
      { name: "banner", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    auth,
  ],
  collectionController.add
);
router.put(
  "/update",
  [
    check("collection_keyword").not().isEmpty(),
    upload.fields([
      { name: "banner", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    auth
  ],
  collectionController.update
);
router.get("/fulllist", adminauth, collectionController.getAdminList);
router.get("/list", optionalauth, collectionController.list);
router.get("/detail", collectionController.view);
router.delete(
  "/delete",
  [check("collection_keyword").not().isEmpty(), auth],
  collectionController.delete
);

module.exports = router;
