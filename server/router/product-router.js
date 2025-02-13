const express = require("express");
const router = express.Router();
const Product = require("../controllers/product-controller");
const {blogSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));
router.use(express.static(path.resolve(__dirname,'public')))

const storage = multer.diskStorage({
  destination: function(req,file, cb){
    if(!fs.existsSync("public")){
        fs.mkdirSync("public");
    }
    if(!fs.existsSync("public/product")){
        fs.mkdirSync("public/product");
    }
    cb(null, "public/product");
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
    storage:storage,
})


router.route("/addpc").post(Product.addpc);
router.route("/updatepc/:id").patch(Product.updatepc);
router.route("/getpc").get(Product.getpc);
router.route("/deletepc/:id").delete(Product.deletepc);
router.route("/addpsubc").post(Product.addpsubc);
router.route("/addpropay").post(Product.addpaymentoption);
router.route("/updatepropay/:id").patch(Product.updatepaymentoption);
router.route("/getpropay").get(Product.getpropay);
router.route("/deletepropay/:id").delete(Product.deletepropay);
//product feature
router.route("/addprofea").post(Product.addprofea);
router.route("/updateprofea/:id").patch(Product.updateprofea);
router.route("/getprofea").get(Product.getprofea);
router.route("/getprofeabyid/:id").get(Product.getprofeabyid);
router.route("/deleteprofea/:id").delete(Product.deleteprofea);

//product addons
router.route("/addaddons").post(Product.addproaddon);
router.route("/updateaddons/:id").patch(Product.updateaddon);
router.route("/getaddons").get(Product.getaddon);
router.route("/deleteaddons/:id").delete(Product.deleteaddon);

router.post("/addproduct",upload.fields([ { name: 'featuredimage'},{ name: 'mainimage'}]), Product.addproduct);
router.patch("/updateproduct/:id",upload.fields([ { name: 'featuredimage', maxCount: 1 },{ name: 'mainimage', maxCount: 1 }]), Product.updateproduct);
router.route("/getproduct").get(Product.getproduct);
router.route("/deleteproduct/:id").delete(Product.deleteproduct);

//for front 
router.route("/frontlist").get(Product.frontlist);


module.exports = router;