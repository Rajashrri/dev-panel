const express = require("express");
const router = express.Router();
const Package = require("../controllers/package-controller");
const {blogSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));
router.use(express.static(path.resolve(__dirname,'public')))


router.route("/additem").post(Package.additem);

router.route("/getdata").get(Package.getdata);
router.route("/getitemByid/:id").get(Package.getitemByid);
router.route("/updateItem/:id").patch(Package.updateItem);

router.route("/deleteitem/:id").delete(Package.deleteitem);
router.route("/update-statusitem").patch(Package.updateStatus);

//addons
router.route("/addaddons").post(Package.addaddons);
router.route("/getdataaddons").get(Package.getdataaddons);
router.route("/getaaddonsByid/:id").get(Package.getaaddonsByid);
router.route("/updateAddons/:id").patch(Package.updateAddons);
router.route("/deleteaddons/:id").delete(Package.deleteaddons);
router.route("/update-statusAddnons").patch(Package.updateStatusAddons);


//package

router.route("/addpackage").post(Package.addpackage);
router.route("/getdataOptions").get(Package.getdataByidcat);
router.route("/getpackageByid/:id").get(Package.getpackageByid);
router.route("/editpackage/:id").patch(Package.editpackage);
router.route("/getItempackges/:id").get(Package.getItempackges);
router.route("/getdataOptionsedit").get(Package.getdataOptionsedit);
router.route("/getdatpackage").get(Package.getdatpackage);
router.route("/deletepackage/:id").delete(Package.deletepackage);
router.route("/additemForpackagee").post(Package.additemForpackagee);
router.route("/update-statusPackage").patch(Package.updateStatusPackage);

router.use(bodyparser.urlencoded({extended:true}));
router.use(express.static(path.resolve(__dirname,'public')))

    const storage = multer.diskStorage({
        destination: function(req,file, cb){
        if(!fs.existsSync("public")){
            fs.mkdirSync("public");
        }
        if(!fs.existsSync("public/allimages")){
            fs.mkdirSync("public/allimages");
        }
    
        cb(null, "public/allimages");
        },
        filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
        },
    });
  
    const upload = multer({
        storage:storage,
    })







module.exports = router;