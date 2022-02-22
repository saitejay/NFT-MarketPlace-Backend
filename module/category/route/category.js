/*
Project : NFT-marketplace
FileName : category.js
*/

var express = require('express')
const multer = require('multer');
var router = express.Router();
var categoryController = require("./../controller/categoryController")
var adminauth = require("./../../../middleware/adminauth");
const { check } = require('express-validator');

const upload = multer();

router.get('/list',categoryController.getList)
router.get('/detail',categoryController.details);
router.get('/fulllist',adminauth,categoryController.getAdminList)
router.post('/add',[check('title').not().isEmpty(), upload.single('category_image'),adminauth],categoryController.add)
router.put('/update',[check('category_id').not().isEmpty(), upload.single('category_image'),adminauth],categoryController.edit)
router.delete('/delete',[check('category_id').not().isEmpty(),adminauth],categoryController.delete)
module.exports = router