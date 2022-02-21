/*
Project : NFT-marketplace
FileName : collectionController.js
*/

var collections = require("../model/collectionModel");
var items = require("../../item/model/itemModel");
var userController = require("./../../user/controller/userController");
var validator = require("validator");
const { validationResult } = require("express-validator");
var cp = require("child_process");
var Web3 = require("web3");
const config = require("../../../helper/config");
var fs = require("fs");
const { collection } = require("../model/collectionModel");
const { Console } = require("console");
const itemModel = require("../../item/model/itemModel");
const userModel = require("../../user/model/userModel");
const cloudinary = require("cloudinary").v2;
const { uploadImages } = require("../../../helper/uploadToCloudinary");
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});
/*
 * This is the function which used to add collection in database
 */
exports.add = async function (req, res) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        // console.log();
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors: errors.array(),
        });
        return;
    }

    var collection = new collections();
    //   console.log(req.files);
    //   console.log(req.body);
    try {
        let path = "/artopera/collection/banner/";
        let uploadResponse1 = await uploadImages(
            req.files.banner[0].buffer,
            path
        );
        // console.log(uploadResponse1);
        collection.banner = uploadResponse1.secure_url;
    } catch (error) {
        res.status(401).json({
            status: false,
            message: "Collection banner upload failed.",
            errors: error,
        });
        return;
    }

    try {
        let path = "/artopera/collection/image/";
        let uploadResponse2 = await uploadImages(
            req.files.image[0].buffer,
            path
        );
        // console.log(uploadResponse2);
        collection.image = uploadResponse2.secure_url;
    } catch (error) {
        res.status(401).json({
            status: false,
            message: "Collection image upload failed.",
            errors: error,
        });
        return;
    }

    collection.collection_id = req.body.collection_id;
    let name = req.body.name;
    let keyword = name.toLowerCase().split(" ").join("-");
    collection.collection_keyword = keyword;
    collection.name = name;
    collection.description = req.body.description ? req.body.description : "";
    collection.royalties = req.body.royalties ? req.body.royalties : 0;
    collection.status = 1;
    collection.author_address = req.decoded.public_key;
    collection.collection_address = req.body.collection_address;
    collection.contract_symbol = req.body.token_symbol;
    userModel.findOne(
        { public_key: req.decoded.public_key },
        function (err, userObj) {
            collection.creator_name = userObj.username;
            collection.creator_image = userObj.profile_image;
            collection.save(function (err, collectionObj) {
                if (err) {
                    res.status(401).json({
                        status: false,
                        message: "Request failed",
                        errors: err,
                    });
                    return;
                }
                res.status(200).json({
                    status: true,
                    message: "Collection created successfully",
                    result: collectionObj,
                });
            });
        }
    );
};

/*
 * This is the function which used to update collection in database
 */
exports.update = function (req, res) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors: errors.array(),
        });
        return;
    }
    // console.log(req.body);
    collections.findOne(
        {
            collection_keyword: req.body.collection_keyword,
            author_address: req.decoded.public_key,
        },
        async function (err, collection) {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Request failed",
                    errors: err,
                });
                return;
            } else if (!collection) {
                res.status(404).json({
                    status: false,
                    message: "Collection not found",
                    errors: err,
                });
            } else {
                // console.log(collection);
                collection.name = req.body.name
                    ? req.body.name
                    : collection.name;
                collection.description = req.body.description
                    ? req.body.description
                    : collection.description;

                if (req.files) {
                    // console.log(req.files);
                    if (req.files.image != undefined) {
                        // console.log(req.files.image[0]);
                        const prevImage = collection.image;
                        // console.log(prevImage);
                        const tempUrlArray1 = prevImage.split("/");
                        const cloudinaryPublicId1 = tempUrlArray1
                            .slice(
                                tempUrlArray1.indexOf("artopera"),
                                tempUrlArray1.length
                            )
                            .join("/")
                            .split(".")[0];
                        // console.log(cloudinaryPublicId1);
                        try {
                            let deleteResponse1 =
                                await cloudinary.uploader.destroy(
                                    cloudinaryPublicId1
                                );
                            // console.log(deleteResponse1);
                        } catch (error) {
                            res.status(401).json({
                                status: false,
                                message:
                                    "Previous collection image delete failed.",
                                errors: error,
                            });
                            return;
                        }
                        try {
                            let path1 = "/artopera/collection/image/";
                            let uploadResponse1 = await uploadImages(
                                req.files.image[0].buffer,
                                path1
                            );
                            // console.log(uploadResponse1);
                            collection.image = uploadResponse1.secure_url;
                        } catch (error) {
                            res.status(401).json({
                                status: false,
                                message: "Collection image upload failed.",
                                error: error,
                            });
                        }
                    }

                    if (req.files.banner != undefined) {
                        // console.log(req.files.banner[0]);
                        const prevBanner = collection.banner;
                        // console.log(prevBanner);
                        const tempUrlArray2 = prevBanner.split("/");
                        const cloudinaryPublicId2 = tempUrlArray2
                            .slice(
                                tempUrlArray2.indexOf("artopera"),
                                tempUrlArray2.length
                            )
                            .join("/")
                            .split(".")[0];
                        // console.log(cloudinaryPublicId2);
                        try {
                            let deleteResponse2 =
                                await cloudinary.uploader.destroy(
                                    cloudinaryPublicId2
                                );
                            // console.log(deleteResponse2);
                        } catch (error) {
                            res.status(401).json({
                                status: false,
                                message:
                                    "Previous collection banner delete failed.",
                                errors: error,
                            });
                            return;
                        }
                        try {
                            let path2 = "/artopera/collection/banner/";
                            let uploadResponse2 = await uploadImages(
                                req.files.banner[0].buffer,
                                path2
                            );
                            // console.log(uploadResponse2);
                            collection.banner = uploadResponse2.secure_url;
                        } catch (error) {
                            res.status(401).json({
                                status: false,
                                message: "Collection banner upload failed.",
                                error: error,
                            });
                        }
                    }
                }

                collection.royalties = req.body.royalties
                    ? req.body.royalties
                    : collection.royalties;
                collection.save(function (err, collection) {
                    if (err) {
                        res.status(400).json({
                            status: false,
                            message: "Request failed",
                            errors: err,
                        });
                        return;
                    } else {
                        res.status(200).json({
                            status: true,
                            message: "Collection updated successfully",
                            result: collection,
                        });
                    }
                });
            }
        }
    );
};

/*image
 * This is the function which used to delete collection in database
 */
exports.delete = function (req, res) {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        res.status(400).json({
            status: false,
            message: "Request failed",
            errors: errors.array(),
        });
        return;
    }
    // console.log(req.body);
    collections.findOne(
        {
            collection_keyword: req.body.collection_keyword,
            author_address: req.decoded.public_key,
        },
        async function (err, collection) {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Request failed",
                    errors: err,
                });
                // return;
            } else if (!collection) {
                res.status(404).json({
                    status: false,
                    message: "Collection not found",
                    errors: err,
                });
            } else {
                const image = collection.image;
                // console.log(image);
                const tempUrlArray1 = image.split("/");
                const cloudinaryPublicId1 = tempUrlArray1
                    .slice(
                        tempUrlArray1.indexOf("artopera"),
                        tempUrlArray1.length
                    )
                    .join("/")
                    .split(".")[0];
                // console.log(cloudinaryPublicId1);
                try {
                    let deleteResponse1 = await cloudinary.uploader.destroy(
                        cloudinaryPublicId1
                    );
                    // console.log(deleteResponse1);
                } catch (error) {
                    res.status(401).json({
                        status: false,
                        message: "Collection image delete failed.",
                        errors: error,
                    });
                    return;
                }

                const banner = collection.banner;
                // console.log(banner);
                const tempUrlArray2 = banner.split("/");
                const cloudinaryPublicId2 = tempUrlArray2
                    .slice(
                        tempUrlArray2.indexOf("artopera"),
                        tempUrlArray2.length
                    )
                    .join("/")
                    .split(".")[0];
                // console.log(cloudinaryPublicId2);
                try {
                    let deleteResponse2 = await cloudinary.uploader.destroy(
                        cloudinaryPublicId2
                    );
                    // console.log(deleteResponse2);
                } catch (error) {
                    res.status(401).json({
                        status: false,
                        message: "Collection banner delete failed.",
                        errors: error,
                    });
                    return;
                }

                items.find(
                    { collection_keyword: req.body.collection_keyword },
                    function (err, itemObjs) {
                        if (err) {
                            res.status(400).json({
                                status: false,
                                message: "Request failed",
                                errors: err,
                            });
                        } else if (itemObjs.length != 0) {
                            itemObjs.forEach(async (item) => {
                                const media = item.media;
                                // console.log(media);
                                const tempMediaArray = media.split("/");
                                const cloudinaryPublicId1 = tempMediaArray
                                    .slice(
                                        tempMediaArray.indexOf("artopera"),
                                        tempMediaArray.length
                                    )
                                    .join("/")
                                    .split(".")[0];
                                // console.log(cloudinaryPublicId1);
                                try {
                                    let deleteResponse1;
                                    if (item.media_type == "video") {
                                        deleteResponse1 =
                                            await cloudinary.uploader.destroy(
                                                cloudinaryPublicId1,
                                                {
                                                    resource_type: "video",
                                                }
                                            );
                                    } else if (item.media_type == "image") {
                                        deleteResponse1 =
                                            await cloudinary.uploader.destroy(
                                                cloudinaryPublicId1
                                            );
                                    } else {
                                        deleteResponse1 =
                                            await cloudinary.uploader.destroy(
                                                cloudinaryPublicId1,
                                                {
                                                    resource_type: "auto",
                                                }
                                            );
                                    }
                                    // console.log(deleteResponse1);
                                } catch (error) {
                                    res.status(401).json({
                                        status: false,
                                        message:
                                            "NFT item media delete failed.",
                                        error: error,
                                    });
                                    return;
                                }
                                const thumb = item.thumb;
                                // console.log(thumb);
                                const tempThumbArray = thumb.split("/");
                                const cloudinaryPublicId2 = tempThumbArray
                                    .slice(
                                        tempThumbArray.indexOf("artopera"),
                                        tempThumbArray.length
                                    )
                                    .join("/")
                                    .split(".")[0];
                                // console.log(cloudinaryPublicId2);
                                try {
                                    let deleteResponse2 =
                                        await cloudinary.uploader.destroy(
                                            cloudinaryPublicId2
                                        );
                                    // console.log(deleteResponse2);
                                } catch (error) {
                                    res.status(401).json({
                                        status: false,
                                        message:
                                            "NFT item thumb delete failed.",
                                        error: error,
                                    });
                                    return;
                                }
                            });
                            items.deleteMany(
                                {
                                    collection_keyword:
                                        req.body.collection_keyword,
                                },
                                function (err, deleteCount) {
                                    if (err) {
                                        res.status(400).json({
                                            status: false,
                                            message: "Request failed",
                                            errors: err,
                                        });
                                    } else {
                                        collections.deleteOne(
                                            {
                                                collection_keyword:
                                                    req.body.collection_keyword,
                                            },
                                            function (err) {
                                                if (err) {
                                                    res.status(400).json({
                                                        status: false,
                                                        message:
                                                            "Request failed",
                                                        errors: err,
                                                    });
                                                } else {
                                                    res.json({
                                                        status: true,
                                                        message:
                                                            "Collection deleted successfully",
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        } else {
                            collections.deleteOne(
                                {
                                    collection_keyword:
                                        req.body.collection_keyword,
                                },
                                function (err) {
                                    if (err) {
                                        res.status(400).json({
                                            status: false,
                                            message: "Request failed",
                                            errors: err,
                                        });
                                    } else {
                                        res.json({
                                            status: true,
                                            message:
                                                "Collection deleted successfully",
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

/**
 *  This is the function which used to view collection
 */
exports.view = function (req, res) {
    collections
        .findOne({ collection_keyword: req.query.collection_keyword })
        .exec(function (err, collection) {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Request failed",
                    errors: "Database failure",
                });
                return;
            }
            if (!collection) {
                res.status(404).json({
                    status: false,
                    message: "Request failed",
                    errors: "Collection not found",
                });
                return;
            }
            res.status(200).json({
                status: true,
                message: "Collection info retrieved successfully",
                result: collection,
            });
        });
};

/**
 * This is the function which used to list collection with filters
 */
exports.list = function (req, res) {
    var keyword = req.query.keyword ? req.query.keyword : "";
    keyword = keyword.replace("+", " ");
    var page = req.query.page ? req.query.page : "1";
    var query = collections.find();
    var offset = page == "1" ? 0 : parseInt(page - 1) * 10;
    if (keyword != "") {
        search = {
            $or: [
                {
                    name: {
                        $regex: new RegExp(keyword, "ig"),
                    },
                },
                {
                    description: {
                        $regex: new RegExp(keyword, "ig"),
                    },
                },
            ],
        };
        query = query.or(search);
    }
    if (req.query.type == "my") {
        if (req.decoded.public_key != null) {
            query = query
                .where("author_address", req.decoded.public_key)
                .sort("-create_date");
        }
    } else if (req.query.type == "item") {
        if (req.decoded.public_key != null) {
            query = query.sort("-item_count");
        }
    } else {
        query = query.where("status", 1).sort("-create_date");
    }

    var options = {
        select: "name banner image item_count collection_keyword",
        page: page,
        offset: offset,
        limit: 10,
    };
    collections.paginate(query, options).then(function (result) {
        if (!result.docs[0]) {
            res.status(404).send({
                status: false,
                message: "No collections available",
            });
        } else {
            res.status(200).json({
                status: true,
                message: "Collection retrieved successfully",
                data: result,
            });
        }
    });
};

/**
 * This is the function which used to list all items for admin
 */
exports.getAdminList = function (req, res) {
    var keyword = req.query.keyword ? req.query.keyword : "";
    keyword = keyword.replace("+", " ");
    var page = req.query.page ? req.query.page : "1";
    var query = collections.find();
    var offset = page == "1" ? 0 : parseInt(page - 1) * 10;
    if (keyword != "") {
        search = {
            $or: [
                {
                    name: {
                        $regex: new RegExp(keyword, "ig"),
                    },
                },
                {
                    description: {
                        $regex: new RegExp(keyword, "ig"),
                    },
                },
            ],
        };
        query = query.or(search);
    }
    query = query.sort("-create_date");
    var options = {
        select: "name description banner image royalties",
        page: page,
        offset: offset,
        limit: 10,
    };
    collections.paginate(query, options).then(function (result) {
        res.json({
            status: true,
            message: "Collection retrieved successfully",
            data: result,
        });
    });
};
