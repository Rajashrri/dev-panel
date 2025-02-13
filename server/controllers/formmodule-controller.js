const mongoose = require('mongoose');
const {Page, Field, Sidebar, Template, Templatefields, Usertemplatefields} = require("../models/formmodule-model");
const Customer = require("../models/customer-model");

    async function createTable(req, res) {
        try {
            const table_name = req.body.table_name;
            const icon = req.body.selectedOption1;
            // const userid = req.body.user_id;
            const lowercase = table_name.toLowerCase();
            const page_url = lowercase.replace(/\s+/g, '-'); // Replace spaces with hyphens
            const table_name_db1 = lowercase.replace(/\s+/g, '_'); // Replace spaces with underscores

            // const customer = await Customer.findOne({_id:userid});
            // const user_name = customer.username;
            // const lowercase1 = user_name.toLowerCase();
            // const username_db = lowercase1.replace(/\s+/g, '_'); // Replace spaces with underscores
            // const table_name_db = `${username_db}_${table_name_db1}`;
            // // Check if a page with the same table_name already exists
           
             const table_name_db = table_name_db1;
            const existingPage = await Page.findOne({ table_name: table_name_db });
            if (existingPage) {
                return res.json({ error: true, message: "Page already exists" }); // Ensure this is the only response in this block
            }
            // Insert page data
            const page = new Page({
                page_name: lowercase.charAt(0).toUpperCase() + lowercase.slice(1),
                page_url,
                table_name: table_name_db,
                icon_id:icon,
                createdBy: req.user_id,  // Assume req.user_id contains the ID of the logged-in user
                // user_id:userid,
                createdDate: new Date()
            });

            await page.save();

            const savedPage = await page.save();
            const pageId = savedPage._id;
          
            const fields = req.body.fields;
            for (const field of fields) {
              const fieldData = {
                page_id: pageId,
                // user_id:userid,
                fields_name: field.name,
                // type: field.type,
                // fields_length: field.length,
                fields_validation: field.validation,
                // fields_key: field.key,
                fields_type: field.inputtype,
                drodown: field.drodown,
                // createdBy: req.user._id,
                createdDate: new Date()
              };
          
              const savedField = await Field.create(fieldData);
            }

            
            // Create dynamic MongoDB collection
            // const dynamicCollection = mongoose.connection.collection(table_name_db);
            // await dynamicCollection.insertOne({            
            // });  

            // This is the only response sent if everything goes well
            return res.json({ error: false, page_id: pageId });
        } catch (error) {
            console.error("Error in createTable:", error.message);

            // This response will only be sent if there is an error and no response has been sent yet
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    };

    function ucwords(str) {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };


    const create_pages = async (req,res)=>{
        try {
            const { table_name, fields ,selectedOption1} = req.body;

            // Validate table_name
            if (!table_name) {
            return  res.status(201).json({ error: true, msg: 'Table Name is required' });
            }

            // Validate fields (if present)
            if (fields && !Array.isArray(fields)) {
                return  res.status(201).json({ error: true, msg: 'Fields must be an array' });
            }
        
            const response = await createTable(req, res);
            
            if (response.error === false) {
                res.status(201).json({
                    msg: 'Page and Table is Created Successfully.',
                    page_id: response.page_id,
                });
            
            } else {
                res.status(201).json({
                    msg: 'Page and Data Table already Exist.',
                });
            }

        } catch (error) {
            console.error("Error in create_pages:", error.message); // Log the error message
            // res.status(201)\.json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    };


    async function updateTable(req) {
        try {
            const { table_name, fields } = req.body;
            const page_id = req.params.id;
    
            if (!table_name || !page_id) {
                return { error: true, message: 'Table Name and Page ID are required' };
            }
    
            const lowercase = table_name.toLowerCase();
            const page_url = lowercase.replace(/\s+/g, '-'); // Replace spaces with hyphens
            const table_name_db1 = lowercase.replace(/\s+/g, '_'); // Replace spaces with underscores
            const table_name_db = table_name_db1;
    
            // Check if a page with the provided page_id exists
            const existingPage = await Page.findOne({ _id: page_id });
            if (!existingPage) {
                return { error: true, message: "Page not found" };
            }
    
            // Update the page details
            existingPage.page_name = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
            existingPage.page_url = page_url;
            existingPage.table_name = table_name_db;
            existingPage.updatedDate = new Date();
            await existingPage.save();
    
            // Update fields if provided
            if (fields && Array.isArray(fields)) {
                for (const field of fields) {
                    const existingField = await Field.findOne({ page_id: page_id, fields_name: field.name });
                    if (existingField) {
                        // Update existing field
                        existingField.fields_name = field.name;
                        existingField.fields_validation = field.validation;
                        existingField.fields_type = field.inputtype;
                        existingField.dropdown = field.dropdown;

                        existingField.updatedDate = new Date();
                        await existingField.save();
                    } else {
                        // Create a new field
                        const fieldData = {
                            page_id: page_id,
                            fields_name: field.name,
                            fields_validation: field.validation,
                            fields_type: field.inputtype,
                            dropdown: field.dropdown,
                            createdDate: new Date(),
                        };
                        await Field.create(fieldData);
                    }
                }
            }
    
            // Optionally update dynamic MongoDB collection
            // const dynamicCollection = mongoose.connection.collection(table_name_db);
    
            return { error: false, message: "Page and Table updated successfully.", page_id: page_id };
        } catch (error) {
            console.error("Error in updateTable:", error.message);
            return { error: true, message: error.message };
        }
    }


    const update_pages = async (req, res) => {
        try {
            const { table_name, fields } = req.body;
            const page_id = req.params.id;
    
            // Input validation
            if (!table_name || !fields) {
                return res.status(400).json({ error: true, msg: "Table name and fields are required." });
            }
    
            let response;
    
            // If page_id is provided, call updateTable; otherwise, call createTable
            if (page_id) {
                response = await updateTable(req); // Don't pass `res`
            } else {
                response = await createTable(req); // Don't pass `res`
            }
    
            if (response.error === false) {
                return res.status(page_id ? 200 : 201).json({
                    msg: page_id
                        ? `Page with ID ${page_id} and its table updated successfully.`
                        : `New page and table created successfully.`,
                    page_id: response.page_id,
                });
            } else {
                return res.status(400).json({ error: true, msg: response.message });
            }
        } catch (error) {
            console.error("Error in update_pages:", {
                error: error.message,
                page_id: req.params.id,
                body: req.body,
            });
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    };

    const getdata  = async (req,res)=>{
        try {
            const id = req.params.id;
            const page = await Page.find({ _id: id });
            const fields = await Field.find({ page_id: id });
            res.status(200).json({
                page:page,
                fields: fields,
        
            });
        }catch(error){
            console.error("Error in getdata:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    };

    const getfieldbyurl = async(req,res) =>{
        try {
            const id = req.params.id; 
            const page = await Page.findOne({ page_url: id }); 
        
            if (!page) {
                return res.status(404).json({ error: "Page not found" }); 
            }
        
            const fields = await Field.find({ 
                page_id: page._id, 
                fields_validation: { $ne: "Auto Save" } 
            });
        
            res.status(200).json({
                page,
                fields,
              
            });
        } catch (error) {
            console.error("Error in getdata:", error.message);
            res.status(500).json({ error: "Internal Server Error", details: error.message }); 
        }

    }

    const getall  = async (req,res)=>{
        try {
            const page = await Page.find();
            res.status(200).json({
                page:page,
        
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }

    };

    const deletedata = async (req,res)=>{
        try {

            const id = req.params.id;
            const re = await Page.findOne({_id:id});
            const collection= re.table_name;
            await mongoose.connection.dropCollection(collection);
            const response = await Page.deleteMany(({_id:id}));
            const reponsedata  = await Field.deleteMany(({page_id:id}));
        
            if(!response || !reponsedata){
                res.status(404).json({msg:"No Data Found"});
                return;
            }
            res.status(200).json({msg:response});
        } catch (error) {
            console.error("Error in deletedata:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    };

    const deletefield = async (req,res)=>{
        try {
            const id = req.params.id;
            const response = await Field.findOneAndDelete(({_id:id}));
        
            if(!response){
                res.status(404).json({msg:"No Data Found"});
                return;
            }
            res.status(200).json({msg:'Data Deleted Successfully'});
        } catch (error) {
            console.error("Error in deletedata:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    };

    const addsidebaricon = async (req, res) => {
        try {
          const insertdata = req.body;
          const icontitle = insertdata.icontitle;
      
          if (req.file) {
            insertdata.icon = req.file.filename; // Save the filename from multer
          }
      
          
          const dataExist = await Sidebar.findOne({ icontitle });
      
          if (dataExist) {
            return res.status(400).json({ msg: "Icon title already exists" });
          }
      
         
          const cmCreated = await Sidebar.create({
            icontitle,
            icon: insertdata.icon, 
          });
      
          const icondata = await Sidebar.find();
          res.status(201).json({
            msg: icondata,
          });
      
        } catch (error) {
          console.error("Error in addsidebaricon:", error.message);
          res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
      };

    const getSidebarOptions  = async (req,res)=>{
        try {
            const page = await Sidebar.find();
            res.status(200).json({
                msg:page,
        
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }

    };



    const getPageOptions  = async (req,res)=>{
        try {
            const page = await Page.find();
            res.status(200).json({
                msg:page,
        
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }

    };
    const addtemplate = async(req,res)=>{
        try {
            const template_name = req.body.templ;
            const bussacc = req.body.bussacc;
            const fields = req.body.pageid;
            console.log(fields);
            const dataExist = await Template.findOne({ template_name });
        
            if (dataExist) {
                return res.status(400).json({ msg: "Template Name already exists" });
            }

            const cmCreated = await Template.create({
                template_name,
                createdDate: new Date(),
            });

            const template_id = cmCreated._id.toString();
            
           
                for (const field of fields) {
                    const fieldData = {
                        template_id:template_id,
                        pageid: field.id,
                        pagename: field.name,
                    };
                    const savedField = await Templatefields.create(fieldData);
                }
            
                const updatecust = await Customer.updateOne({ _id:bussacc },{
                $set:{
                    admintemplate_id: template_id,      
                }
            },{
                new:true,
            });
            res.status(200).json({msg:'Template added Successfully',template_id:template_id});  
        }catch(error){
            console.error("Error in addtemplate:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const gettemplates  = async (req,res)=>{
        try {
            const template = await Template.find();
            res.status(200).json({
                template:template,
        
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }

    };

    const getpage = async (req, res) => {
        try {
            const id = req.params.id.trim();
            const page = await Page.find({
                page_name: { $regex: id, $options: 'i' }
              });
              
            res.status(200).json({
                page:page,
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const gettemfields = async (req, res) => {
        try {
            const id = req.params.id.trim();
            const page = await Templatefields.find({
                template_id: id
              });
              
            res.status(200).json({
                tempfields:page,
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const getsearchtemplates = async (req, res) => {
        try {
            const id = req.params.id.trim();
            const template = await Template.find({
                template_name: { $regex: id, $options: 'i' }
              });
              
            res.status(200).json({
                template:template,
            });
        }catch(error){
            console.error("Error in getall:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const getadditionalmodules = async (req, res) => {
        const preids = req.body.preids; // Extract `preids` from the request body
        try {
            // Validate that preids is an array
            if (!Array.isArray(preids)) {
                return res.status(400).json({ error: "Invalid input: preids must be an array." });
            }
    
            // Extract `id` values from preids and convert them to ObjectId using `new`
            const excludedIds = preids.map(item => new mongoose.Types.ObjectId(item.id));
    
            // Query Templatefields excluding the IDs in `excludedIds`
            const page = await Page.find({
                _id: { $nin: excludedIds }, // Exclude these IDs
            });
    
            res.status(200).json({
                tempfields: page,
            });
        } catch (error) {
            console.error("Error in getadditionalmodules:", error.message);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    };
    
     const updatetmeplateid = async(req,res)=>{
        const template_id = req.body.id;
        const bussacc = req.body.bussacc;
        
        try {
            const updatecust = await Customer.updateOne({ _id:bussacc },{
                $set:{
                    admintemplate_id: template_id,      
                }
            },{
                new:true,
            });


            const fields = await Templatefields.find({
                template_id: template_id
              });

              const deletedata = await Usertemplatefields.deleteMany(({user_id:bussacc}));

              for (const field of fields) {
                const fieldData = {
                    user_id:bussacc,
                    pageid: field.pageid,
                    pagename: field.pagename,
                };
                const savedField = await Usertemplatefields.create(fieldData);
            }


            res.status(200).json({
                msg:'Admin Template Selected.',
            });
        } catch (error) {
            console.error("Error in getadditionalmodules:", error.message);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
        
     }
    
     const getpage1 = async (req, res) => {
        try {
            const id = req.params.id.trim();
            const preids = req.body.preids;
            if (!Array.isArray(preids)) {
                return res.status(400).json({ error: "Invalid input: preids must be an array." });
            }

            const excludedIds = preids.map(item => new mongoose.Types.ObjectId(item.id));
    
            // Query Templatefields excluding the IDs in `excludedIds`
            const page = await Page.find({
                _id: { $nin: excludedIds }, 
                page_name: { $regex: id, $options: 'i' }
            });
              
            res.status(200).json({
                page:page,
            });
        }catch(error){
            console.error("Error in getpage1:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const inmodagclt =async (req,res)=>{
        try {
            const pageid = req.body.pageid;
            const pagename = req.body.pagename;
            const bussacc = req.body.bussacc;
           

            // const dataExist = await Usertemplatefields.findOne({ pageid:pageid, user_id:bussacc });
        
            // if (dataExist) {
            //     return res.status(400).json({ msg: "Already exists" });
            // }

            const cmCreated = await Usertemplatefields.create({
                user_id:bussacc,
                pageid: pageid,
                pagename: pagename,
              });

            res.status(200).json({
                msg:'Module added successfully',
            });


        } catch (error) {
            console.error("Error in inmodagclt:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const getclientmodules = async(req,res)=>{
        try {
            const id = req.params.id.trim();
            const preids = req.body.preids;
            if (!Array.isArray(preids)) {
                return res.status(400).json({ error: "Invalid input: preids must be an array." });
            }

            const excludedIds = preids.map(item => new mongoose.Types.ObjectId(item.id));
    
            // Query Templatefields excluding the IDs in `excludedIds`
            const page = await Usertemplatefields.find({
                pageid: { $nin: excludedIds }, 
                user_id:id ,
            });
              
            res.status(200).json({
                page:page,
            });
        }catch(error){
            console.error("Error in getpage1:", error.message); // Log the error message
            res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
        }
    }

    const getroutesdata = async (req, res) => {
        try {
          const custid = req.params.id;
      
          // Check if Customer exists
          const customer = await Customer.findOne({ _id: custid });
          if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
          }
      
          // Fetch template fields
          const template_id = customer.admintemplate_id;
          const tempfields = await Templatefields.find({ template_id });
          
          // Fetch template user data
          const tempfieldsuser = await Template.find({ _id: template_id, user_id: custid });
      
          if (tempfields.length > 0 || tempfieldsuser.length > 0) {
            const pageIds = tempfields.map(field => field.pageid);
            const pages = await Page.find({ _id: { $in: pageIds } }); 

                pagesData = pages.map(page => ({
                    pagename: page.page_name,
                    pageid: page._id,
                    pageurl: page.page_url, 
                }));
            }

            if (pagesData.length > 0) {
            return res.status(200).json({ msg: pagesData });
            } else {
            return res.status(404).json({ msg: "No Template Data Found" });
            }
            
      
        } catch (error) {
          console.error("Error in getroutesdata:", error.message);
          res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
      };
      
module.exports = {getfieldbyurl, getclientmodules,getroutesdata, inmodagclt, getpage1, updatetmeplateid, getadditionalmodules,getsearchtemplates, gettemfields, getpage, create_pages,update_pages, getdata, getall, deletedata , deletefield, addsidebaricon , getSidebarOptions,addtemplate,gettemplates,getPageOptions};


//CODE for import data on new database from existing database 

// const mongoose = require('mongoose');

// const existingDb = mongoose.createConnection('mongodb://localhost:27017/oldDatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const newDb = mongoose.createConnection('mongodb://localhost:27017/newDatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// async function importCollections() {
//     try {
//         const collections = await existingDb.db.listCollections().toArray();

//         for (const collectionInfo of collections) {
// //            here we need implode user name's database and then import to new database 
//             const collectionName = collectionInfo.name;
//             const documents = await existingDb.collection(collectionName).find().toArray();

//             if (documents.length > 0) {
//                 await newDb.collection(collectionName).insertMany(documents);
//                 console.log(`Imported ${documents.length} documents into ${collectionName} collection.`);
//             }
//         }

//         console.log('All collections imported successfully!');

//     } catch (error) {
//         console.error('Error importing collections:', error);
//     } finally {
//         existingDb.close();
//         newDb.close();
//     }
// }

// importCollections();