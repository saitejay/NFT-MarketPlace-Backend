/*
Project : NFT-marketplace
FileName : categoryController.js
*/

var categories = require('./../model/categoryModel');
var validator = require('validator');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const config = require('../../../helper/config');
const { uploadImages } = require('../../../helper/uploadToCloudinary');

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});

/*
*  This is the function which used to retreive active category list
*/
exports.getList = async function(req,res) {
    var page = req.query.page ? req.query.page : '1';  
    var query = categories.find();
    var offset = ( page == '1' ) ? 0 : ((parseInt(page-1))*10);
    query = query.where('status' , 'active')    
    query = query.sort('-create_date')
    query.exec(function(err,result){
        res.json({
            status: true,
            message: "Category retrieved successfully",
            data: result
        });
    })
}

/*
*  This is the function which used to retreive category detail by category id
*/
exports.details = function(req,res) {
    // console.log("received params are ", req.params)
    categories.findOne({_id:req.query.category_id}).exec( function (err, category) {
        if (err) {
            res.json({
                status: false,
                message: "Request failed",
                errors:"Category not found"
            });
            return;
        }
        if(!category) {
            res.json({
                status: false,
                message: "Request failed",
                errors:"Category not found"
            });
            return;
        } 
        res.json({
            status: true,
            message: "Category info retrieved successfully",
            result: category
        });
    })
}

/**
 * This is the function which used to list all categories
 */
exports.getAdminList  = function(req,res) {
    var page = req.query.page ? req.query.page : '1';  
    var query = categories.find();
    var offset = ( page == '1' ) ? 0 : ((parseInt(page-1))*10); 
    query = query.sort('-create_date')
    var options = {
    select:   'title category_image status create_date',
    page:page,
    offset:offset,
    limit:15,    
    };  
    categories.paginate(query, options).then(function (result) {
        res.json({
            status: true,
            message: "Category retrieved successfully",
            data: result
        });
    }); 
}

/**
 * This is the function which used to add category from admin
 */
exports.add  = async function(req,res) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var category = new categories();
    // console.log(req.body);
    // console.log(req.file);
    category.title = req.body.title;
    try {
        let path = "/artopera/categories/";
        let uploadResponse = await uploadImages(req.file.buffer, path);
        // console.log(uploadResponse);
        category.category_image = uploadResponse.secure_url;
    } catch (error) {
        res.status(401).json({
            status: false,
            message: "Category image upload failed.",
            errors: error,
        });
        return;
    }
    category.status = req.body.status? req.body.status: 'active';
    category.save(function (err , categoryObj) {
        if (err) {
            res.status(400).json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Category created successfully",
            result: categoryObj
        });
    });
}
/**
 *  This is the function which used to update category 
 */
exports.edit  = function(req,res) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    categories.findOne({_id:req.body.category_id}, async function (err, category) {
        if (err || !category) {
            res.json({
                status: false,
                message: "Category not found",
                errors:err
            });
            return;
        } else {
            // console.log(req.body);
            category.title = req.body.title ?  req.body.title : category.title;
            // category.category_image = req.body.category_image ?  req.body.category_image : category.category_image;
            if (req.file) {
                // console.log(req.file);
                const prevImage = category.category_image;
                // console.log(prevImage);
                const tempUrlArray = prevImage.split("/");
                const cloudinaryPublicId = tempUrlArray
                    .slice(
                        tempUrlArray.indexOf("artopera"),
                        tempUrlArray.length
                    )
                    .join("/")
                    .split(".")[0];
                // console.log(cloudinaryPublicId);
                try {
                    let deleteResponse =
                        await cloudinary.uploader.destroy(
                            cloudinaryPublicId
                        );
                    // console.log(deleteResponse);
                } catch (error) {
                    res.status(401).json({
                        status: false,
                        message: "Previous category image delete failed.",
                        errors: error,
                    });
                    return;
                }
                try {
                    let path = "/artopera/categories/";
                    let uploadResponse = await uploadImages(req.file.buffer, path);
                    // console.log(uploadResponse);
                    category.category_image = uploadResponse.secure_url;
                } catch (error) {
                    res.status(401).json({
                        status: false,
                        message: "Category image upload failed.",
                        errors: error,
                    });
                    return;
                }
            }
            category.status = req.body.status? req.body.status: category.status;
            category.save(function (err , category) {
                if (err) {
                    res.json({
                        status: false,
                        message: "Request failed",
                        errors:err
                    });
                    return;
                } else {
                    res.json({
                        status: true,
                        message: "Category updated successfully",
                        result: category 
                    });  
                }
            });
        }
    });
}

/**
 *  This is the function which used to delete category 
 */
 exports.delete  = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    categories.findOne({_id:req.body.category_id}, async function (err, category) {
        if (err || !category) {
            res.json({
                status: false,
                message: "Category not found",
                errors:err
            });
            return;
        } else {
            const prevImage = category.category_image;
            // console.log(prevImage);
            const tempUrlArray = prevImage.split("/");
            const cloudinaryPublicId = tempUrlArray
                .slice(
                    tempUrlArray.indexOf("artopera"),
                    tempUrlArray.length
                )
                .join("/")
                .split(".")[0];
            // console.log(cloudinaryPublicId);
            try {
                let deleteResponse =
                    await cloudinary.uploader.destroy(
                        cloudinaryPublicId
                    );
                // console.log(deleteResponse);
            } catch (error) {
                res.status(401).json({
                    status: false,
                    message: "Previous category image delete failed.",
                    errors: error,
                });
                return;
            }
            categories.deleteOne({_id:req.body.category_id},function(err) {
                res.json({
                    status: true,
                    message: "Category deleted successfully"
                }); 
            })
        }
    });
 }