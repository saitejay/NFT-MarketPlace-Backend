/*
Project : NFT-marketplace
FileName : user.js
*/

var express = require("express");
const multer = require("multer");
var router = express.Router();
var userController = require("./../controller/userController");
const { check } = require("express-validator");
var auth = require("./../../../middleware/auth");
var adminauth = require("./../../../middleware/adminauth");

const upload = multer();

router.get("/", userController.getList);

router.post(
    "/",
    [
        check("public_key").not().isEmpty(),
        check("username").not().isEmpty(),
        check("display_name").not().isEmpty(),
        check("email").not().isEmpty(),
    ],
    userController.register
);

router.post(
    "/login",
    [check("public_key").not().isEmpty()],
    userController.login
);

// router.put('/forgot', [check('email').isEmail()], userController.forgot)

// router.put('/reset', [auth,check('newpassword').not().isEmpty()],userController.resetpassword)

router.put(
    "/update",
    [
        upload.fields([
            { name: "profile_image", maxCount: 1 },
            { name: "profile_cover", maxCount: 1 },
        ]),
        auth,
    ],
    userController.update
);

// router.put('/change', [check('newpassword').not().isEmpty(),check('oldpassword').not().isEmpty(),auth],userController.changepassword)

router.put("/profilesettings", auth, userController.updatesettings);

router.get("/profile", userController.details);

router.post("/chat", auth, userController.getListByIds);

router.get("/adminlist", adminauth, userController.getAdminList);
router.post("/createuser", adminauth, userController.createUser);
router.post("/updateuser", adminauth, userController.updateUser);

module.exports = router;
