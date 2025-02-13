const {Productcategory,Productsubcategory,PaymentOptions ,ProductFeature,ProductAddon,Product} = require("../models/product-model");

function createCleanUrl(title) {
    // Convert the title to lowercase
    let cleanTitle = title.toLowerCase();
    // Remove special characters, replace spaces with dashes
    cleanTitle = cleanTitle.replace(/[^\w\s-]/g, '');
    cleanTitle = cleanTitle.replace(/\s+/g, '-');
  
    return cleanTitle;
  }

const addpc = async (req,res)=>{
    try {
        console.log(req.body);
        const { name } = req.body;
        const status= '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await Productcategory.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Product category already exist"});

        }

        const cmCreated =  await Productcategory.create( { name , status, url} );
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};



const updatepc = async (req,res)=>{
    try {
        console.log(req.body);
        const { name } = req.body;
        const url = createCleanUrl(req.body.name);
        const id = req.params.id;
 
        const userExist = await Productcategory.findOne({ name, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Product category already exist"});

        }
        const result = await Productcategory.updateOne({ _id:id },{
            $set:{
                name: name,
                url: url,   
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const  getpc = async(req, res) => {
    try {
        const response = await Productcategory.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Productcategory ${error}`);
    }
};

const  deletepc = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await Productcategory.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Productcategory ${error}`);
    }
};

//subcategory

const addpsubc = async (req,res)=>{
    try {
        console.log(req.body);
        const {category_id,name } = req.body;
        const status= '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await Productsubcategory.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Product Subcategory already exist"});

        }

        const cmCreated =  await Productsubcategory.create( { name ,category_id, status, url} );
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};
//Payment Option
const addpaymentoption = async (req,res)=>{
    try {
        console.log(req.body);
        const {days,name } = req.body;
        const status= '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await PaymentOptions.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Payment Option name already exist"});

        }

        const cmCreated =  await PaymentOptions.create( { name ,days, status, url} );
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const updatepaymentoption = async (req,res)=>{
    try {
        console.log(req.body);
        const { name,days } = req.body;
        const url = createCleanUrl(req.body.name);
        const id = req.params.id;
 
        const userExist = await PaymentOptions.findOne({ name, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Product Payment option name already exist"});

        }
        const result = await PaymentOptions.updateOne({ _id:id },{
            $set:{
                name: name,
                days: days,
                url: url,   
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
     res.status(500).json(error);
    }
};
const  getpropay = async(req, res) => {
    try {
        const response = await PaymentOptions.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`PaymentOptions ${error}`);
    }
};

const  deletepropay = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await PaymentOptions.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`PaymentOptions ${error}`);
    }
};

// product features

const addprofea = async (req,res)=>{
    try {
        console.log(req.body);
        const {name,actualinr,discountedinr,actualusd,discountedusd,category,details } = req.body;
        const status= '1';
        // const url = createCleanUrl(req.body.category);
        const userExist = await ProductFeature.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Feature name already exist"});

        }

        const cmCreated =  await ProductFeature.create( {name,actualinr,discountedinr,actualusd,discountedusd,category,details, status} );
        res.status(201).json({
            msg:"Feature Added Successfully",
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const updateprofea = async (req,res)=>{
    try {
        console.log(req.body);
        const { name,actualinr,discountedinr,actualusd,discountedusd,category,details } = req.body;
        // const url = createCleanUrl(req.body.category);
        const id = req.params.id;
 
        const userExist = await ProductFeature.findOne({ name, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Feature name already exist"});

        }
        const result = await ProductFeature.updateOne({ _id:id },{
            $set:{
                category: category,
                details: details,
                name: name,   
                actualinr: actualinr,   
                discountedinr: discountedinr,   
                actualusd: actualusd,   
                discountedusd: discountedusd,    
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const  getprofea = async(req, res) => {
    try {
        const response = await ProductFeature.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`ProductFeature ${error}`);
    }
};
const  getprofeabyid = async(req, res) => {
    const id = req.params.id;
    try {
        const response = await ProductFeature.find({_id:id});
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`ProductFeature ${error}`);
    }
};



const  deleteprofea = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await ProductFeature.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`ProductFeature ${error}`);
    }
};




// Addon's 

const addproaddon = async (req,res)=>{
    try {
        console.log(req.body);
        const {name,details,question } = req.body;
        const status= '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await ProductAddon.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Feature category already exist"});

        }

        const cmCreated =  await ProductAddon.create( { name ,details,question, status, url} );
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const updateaddon = async (req,res)=>{
    try {
        console.log(req.body);
        const { name,details,question } = req.body;
        const url = createCleanUrl(req.body.name);
        const id = req.params.id;
 
        const userExist = await ProductAddon.findOne({ name, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Product addons already exist"});

        }
        const result = await ProductAddon.updateOne({ _id:id },{
            $set:{
                name: name,
                details: details,
                question:question,
                url: url,   
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
     res.status(500).json(error);
    }
};
const  getaddon= async(req, res) => {
    try {
        const response = await ProductAddon.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`ProductAddon ${error}`);
    }
};

const  deleteaddon = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await ProductAddon.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`ProductAddon ${error}`);
    }
};

//product
const addproduct = async (req,res)=>{
    try {
        console.log(req.body);
        const { name, category_id,price,briefintro,details,metatitle,metadescp,metakey,canonicalurl,altfeatured,altmain,schemacode } = req.body;
        const mainimage=req.files['mainimage'][0].filename;
        const featuredimage= req.files['featuredimage'][0].filename;
        const status= '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await Product.findOne({ name });
        
        if(userExist){
            return res.status(400).json({msg:"Product already exist"});
        }

        const cmCreated =  await Product.create( { name,url, status, category_id,price, mainimage,featuredimage,briefintro,details,metatitle,metadescp,metakey,canonicalurl,altfeatured,altmain,schemacode });
        res.status(201).json({
            msg:cmCreated,
            userId:cmCreated._id.toString(),
        });

    } catch (error) {
     res.status(500).json(error);
    }
};

const updateproduct = async (req,res)=>{
    try {
        console.log(req.body);
        const { title, category_id, author_id,date,briefintro,details,metatitle,metadescp,metakey,canonicalurl,altfeatured,altmain,schemacode } = req.body;
        const updateData = req.body;
         if(req.files['mainimage']){
            updateData.mainimage =req.files['mainimage'][0].filename;
         }
         if(req.files['featuredimage']){
            updateData.featuredimage = req.files['featuredimage'][0].filename;
         }
        
         
        const id = req.params.id;
        const url = createCleanUrl(updateData.title);
        updateData.url = url;
        const userExist = await Product.findOne({ title, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Product already exist"});

        }

        const result = await Product.findByIdAndUpdate(id, updateData, { new: true });
        // const result = await Product.updateOne({ _id:id },{
        //     $set:{
        //         title:title,
        //         url:url,
        //         category_id:category_id,
        //         author_id:author_id,
        //         date:date,
        //         mainimage:mainimage,
        //         featuredimage:featuredimage,
        //         briefintro:briefintro,
        //         details:details,
        //         metatitle:metatitle,
        //         metadescp:metadescp,
        //         metakey:metakey,
        //         canonicalurl:canonicalurl,
        //         altfeatured:altfeatured,
        //         altmain:altmain,
        //         schemacode :schemacode
        //     }
        // },{
        //     new:true,
        // });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in updateproduct:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getproduct= async(req, res) => {
    try {
        const response = await Product.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Product ${error}`);
    }
};

const  deleteproduct = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await Product.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Product ${error}`);
    }
};

const frontlist = async(req, res) => {
    try {
        const response = await Product.find({status:1});
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in frontlist:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
}

module.exports = { getprofeabyid,addpc , updatepc , getpc, deletepc,addpsubc,addpaymentoption,updatepaymentoption,getpropay,deletepropay,addprofea,updateprofea,getprofea,deleteprofea,addproaddon,updateaddon, getaddon,deleteaddon,addproduct , updateproduct , getproduct, deleteproduct, frontlist};