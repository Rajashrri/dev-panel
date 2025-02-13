const express = require("express");
// const user = express();
const router = express.Router();
const csvcontrollers = require("../controllers/csv-controller");
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
    if(!fs.existsSync("public/csv")){
        fs.mkdirSync("public/csv");
    }
    cb(null, "public/csv");
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
    storage:storage,
    // fileFilter: function(req, file, cb){
    //     var ext = path.extname(file.originalname);

    //     if(ext !==".csv"){
    //         return cb(new Error("only csvs are allowed"));
    //     }
    // }
})

router.post("/importcsv",upload.single('csvFile'), csvcontrollers.create);

module.exports = router;