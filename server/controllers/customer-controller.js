
const Customer = require("../models/customer-model");
const {Page, Field, Sidebar, Template, Templatefields, Usertemplatefields} = require("../models/formmodule-model");

const bcrypt = require("bcryptjs");

function createCleanUrl(title) {
    // Convert the title to lowercase
    let cleanTitle = title.toLowerCase();
    // Remove special characters, replace spaces with dashes
    cleanTitle = cleanTitle.replace(/[^\w\s-]/g, '');
    cleanTitle = cleanTitle.replace(/\s+/g, '-');
  
    return cleanTitle;
}

const addcust = async (req,res)=>{
    try {
        console.log(req.body);
        const { username, email, phone,compname,address,description,brand } = req.body;
        const password = `${username}@2021`;
        const status= '1';    
        const usercount = await Customer.countDocuments({ isAdmin: { $ne: 'true' } });
       
       
        let cust_id;

        if (usercount === 0) {
            cust_id = 'Cust1';
        } else {
            cust_id = `Cust${usercount + 1}`;
        }

        const userExist = await Customer.findOne({ email });
        
        if(userExist){
            return res.status(400).json({msg:"Email ID already exist"});

        }
        const cmCreated =  await Customer.create( { username, email,password, phone,compname,address,description, brand } );
        res.status(201).json({
            msg:cmCreated,
            busid:cmCreated._id.toString(),
        });

    } catch (error) {
        console.error("Error in addcust:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const updatecust = async (req,res)=>{
    try {
        console.log(req.body);
        const { username, email, phone,compname,address,description,brand } = req.body;

        // const saltRound = await bcrypt.genSalt(10);
        // const hash_password = await bcrypt.hash(password, saltRound);
        const id = req.params.id;
 
        const userExist = await Customer.findOne({ email, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"Customer already exist"});

        }
        const result = await Customer.updateOne({ _id:id },{
            $set:{
                username: username,
                email: email,   
                phone: phone,   
                compname: compname,   
                address: address,   
                description: description,   
                brand: brand,       
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in addcust:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getcust = async(req, res) => {
    try {
        const response = await Customer.find();
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Customer ${error}`);
    }
};

const  getcustbyid = async(req, res) => {
    try {
        const id = req.params.id;
        const response = await await Customer.findOne({ _id: id });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Customer ${error}`);
    }
};

const  deletecust = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await Customer.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Customer ${error}`);
    }
};

const statuscust = async (req,res)=>{
    try {
        
        const { status } = req.body;
        const id = req.params.id;
    
        const result = await Customer.updateOne({ _id:id },{
            $set:{
                status: status,
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


const updateprofile = async (req,res)=>{
    try {
        console.log(req.body);
    
         const id = req.params.id;
        
        const updateData = req.body;
        const email = updateData.email;
        const userExist = await Customer.findOne({ email, _id: { $ne: id }});
        
        const saltRound = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, saltRound);
        if(userExist){
            return res.status(400).json({msg:"Email id already exist"});

        }

        if (req.file) {
            updateData.pic = req.file.filename; 
        }

        const updatedProfile = await Customer.findByIdAndUpdate(id, updateData, { new: true });

        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in updateprofile:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};
const getdatabyid = async(req, res) => {
    try {
        const id = req.params.id;
        const response = await await Customer.findOne({ _id: id });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in updateprofile:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};



module.exports = { addcust , updatecust , getcust, getcustbyid, deletecust , statuscust,updateprofile,getdatabyid};

