const express = require("express");
const router = express.Router();

const Crudcontrollers = require("../controllers/crud-controller");
const multer = require('multer');
const path = require('path');

// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const bodyparser = require("body-parser");

// router.use(bodyparser.urlencoded({extended:true}));
// router.use(express.static(path.resolve(__dirname,'public')))

//     const storage = multer.diskStorage({
//         destination: function(req,file, cb){
//         if(!fs.existsSync("public")){
//             fs.mkdirSync("public");
//         }
//         if(!fs.existsSync("public/allimages")){
//             fs.mkdirSync("public/allimages");
//         }
    
//         cb(null, "public/allimages");
//         },
//         filename: function(req,file,cb){
//         cb(null, Date.now() + file.originalname);
//         },
//     });
  
//     const upload = multer({
//         storage:storage,
//     })


router.route("/add").post(Crudcontrollers.add);

router.route("/delete/:id").delete(Crudcontrollers.deletemodule);
router.route("/status/:id").patch(Crudcontrollers.status);
router.route("/updatedata/:id").patch(Crudcontrollers.update);
router.route("/getdata/:id").patch(Crudcontrollers.getdata);
router.route("/getdataByid/:id").patch(Crudcontrollers.getdataByid);
// router.route("/texteditor").post(Crudcontrollers.texteditor);
router.route("/getcatOptions/:tableName").patch(Crudcontrollers.getdataByidcat);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/texteditor"); // Set the destination folder for file uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename for each uploaded file
    }
});

const upload = multer({ storage });
// Upload endpoint
router.post("/upload", upload.single("upload"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = `http://localhost:5000/public/texteditor/${req.file.filename}`;
        res.status(200).json({
            url: imageUrl, // CKEditor requires this format
        });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed", details: error.message });
    }
});

router.post('/upload', upload.single('upload'), (req, res) => {
    // Handle file upload
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // Send back the uploaded file URL
    res.json({ url: file.path });
});


module.exports = router;