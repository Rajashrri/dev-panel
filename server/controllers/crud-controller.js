const mongoose = require('mongoose');
const fs = require("fs");
const {Schema, model} = require("mongoose");
const {Page, Field} = require("../models/formmodule-model");

const multer = require('multer');
const path = require('path');

// Set up Multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/adminmodules'); // Set your destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique file name
    }
});

// Initialize multer for file uploads
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).any(); // Accept any number of files (we will filter based on the field name)



// const add = async (req,res)=>{
//     try {
//         upload(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json({ error: "Multer Error", details: err.message });
//             } else if (err) {
//                 return res.status(500).json({ error: "Unknown Error", details: err });
//             }

           
           
//             const { user_id, page_name } = req.body;
//             // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
//             const pageExist = await Page.findOne({ page_name: page_name});

//             if (!pageExist) {
//                 return res.status(500).json({ error: "Code Error", details: "Page name doesn't exist" });
//             }

//             const table_name = pageExist.table_name;
//             const page_id = pageExist.id;

//             const fields = await Field.find({ page_id: page_id });
//             let schemaFields = {};
//             let formData = {
//                 user_id: user_id,
//                 // status: 1,
//                 createdDate: new Date(),
//             }; 

//             // Map files from req.files to their field names
//             const filesMap = {};
//             if (req.files && req.files.length > 0) {
//                 req.files.forEach(file => {
//                     filesMap[file.fieldname] = file.filename;
//                 });
//             }   
//             console.log("Files Map:", filesMap);
            

//             // Map through fields to build schema and handle data
//             for (const field of fields) {
//                 const name = field.fields_name;
//                 const type = String;

//                 // Add dynamic field types to schema
//                 schemaFields[name] = { type: type };

//                 if (field.fields_validation === "yes") {
//                     // If it's an image field, ensure there's an uploaded file
//                     if (field.fields_type === 'image' && !filesMap[name]) {
//                         return res.status(400).json({
//                             error: "Image Error",
//                             details: `Field '${name}' is required as an image`,
//                         });
//                     }
//                     // For non-image fields, check in req.body
//                     if (field.fields_type !== 'image' && (!req.body.fields || !req.body.fields[name])) {
//                         return res.status(400).json({
//                             error: "Validation Error",
//                             details: `Field '${name}' is required`,
//                         });
//                     }
//                 }

//                 // Handle image fields
//                 if (field.fields_type === 'image') {
//                     // if (filesMap[name]) {
//                         formData[name] = filesMap[name] || null;
//                     // } else {
//                     //     return res.status(400).json({
//                     //         error: "Image Error",
//                     //         details: `Field '${name}' is required as an image`,
//                     //     });
//                     // }
//                 } else {
//                     // For non-image fields, use form data
//                     formData[name] = req.body.fields[name];
//                 }
//             }

//             // Add fixed fields to schema
//             schemaFields["user_id"] = { type: String };
//             schemaFields["createdDate"] = { type: Date };
//             schemaFields["createdBy"] = { type: String };
//             // schemaFields["status"] = { type: String };

//             // Check if model already exists or create a new one
//             let DB;
//             if (mongoose.models[table_name]) {
//                 DB = mongoose.models[table_name];
//             } else {
//                 const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
//                 DB = mongoose.model(table_name, dynamicSchema);
//             }

//             // Save form data to the database
//             const savedField = await DB.create(formData);

//             console.log("Saved document:", savedField);

//             res.status(201).json({
//                 msg: "Form submitted successfully",
//                 savedField
//             });
//         });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
//     }catch(error){
//         console.error("Error in add:", error); 
//         res.status(500).json({ error: "Internal Server Error", details: error.message }); 
//     }
    
// }

const add = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: "Multer Error", details: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Unknown Error", details: err });
            }

            const { user_id, page_name } = req.body;

            // Check if page exists
            const pageExist = await Page.findOne({ page_name });
            if (!pageExist) {
                return res.status(400).json({ error: "Page does not exist." });
            }

            const table_name = pageExist.table_name;
            const page_id = pageExist.id;

            const fields = await Field.find({ page_id });
            // console.log("Fields:", fields);

            let schemaFields = {};
            let formData = {
                user_id: user_id,
                createdDate: new Date(),
            };

            // Build a map of uploaded files
            const filesMap = {};
            if (req.files && req.files.length > 0) {
                req.files.forEach((file) => {
                    // Clean up fieldname if necessary
                    const fieldName = file.fieldname.replace(/^fields\[|\]$/g, '');
                    filesMap[fieldName] = file.filename;
                });
            }
            console.log("Files Map:", filesMap);

            // Map fields and populate formData
            for (const field of fields) {
                const name = field.fields_name;
                schemaFields[name] = { type: String };
            
                // Validation for required fields
                if (field.fields_validation === "yes") {
                    if (field.fields_type === "file" && !filesMap[name]) {
                        return res.status(400).json({
                            error: "Validation Error",
                            details: `Field '${name}' is required as an image.`,
                        });
                    }
                    if (field.fields_type !== "file" && (!req.body.fields || !req.body.fields[name])) {
                        return res.status(400).json({
                            error: "Validation Error",
                            details: `Field '${name}' is required.`,
                        });
                    }
                }
            
                // Map fields to formData
                if (field.fields_type === "file") {
                    formData[name] = filesMap[name] || null; // Map uploaded file
                } else {
                    formData[name] = req.body.fields ? req.body.fields[name] : null; // Map other form fields
                }
            }

            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Check if the model exists, or create it
            let DB;
            if (mongoose.models[table_name]) {
                DB = mongoose.models[table_name];
            } else {
                const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
                DB = mongoose.model(table_name, dynamicSchema);
            }

            // Save formData to the database
            const savedField = await DB.create(formData);
            console.log("Saved document:", savedField);

            res.status(201).json({
                message: "Form submitted successfully.",
                savedField,
            });
        });
    } catch (error) {
        console.error("Error in add:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



const deletemodule = async (req, res) => {
    try {
        const { user_id, page_name } = req.body;
        const id = req.params.id;

        // Validate inputs
        if (!user_id || !page_name || !id) {
            return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
        }

        // Find the page using the page_name and user_id
        // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
        const pageExist = await Page.findOne({ page_name: page_name});
        if (!pageExist) {
            return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
        }

        const table_name = pageExist.table_name; // Dynamic table name based on page_name

        // Check if the model for this table already exists, or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            // Fetch the fields to dynamically build the schema if it doesn't exist
            const fields = await Field.find({ page_id: pageExist.id });
            let schemaFields = {};
            for (const field of fields) {
                const name = field.fields_name;
                const type = String;
                schemaFields[name] = { type: type };
            }

            // Add fixed fields to schema
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Create the schema for the collection
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Delete the record based on the id
        const deletedRecord = await DB.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({
                error: "Not Found",
                details: "The record you're trying to delete does not exist",
            });
        }

        res.status(200).json({
            msg: "Record deleted successfully",
            deletedRecord,
        });
    } catch (error) {
        console.error("Error in deleteRecord:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const status = async (req,res)=>{
    try {
        const { user_id, page_name, status } = req.body;
        const id = req.params.id;

        // Validate inputs
        if (!user_id || !page_name || !id || !status) {
            return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
        }

        // Find the page using the page_name and user_id
        const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
        if (!pageExist) {
            return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
        }

        const table_name = pageExist.table_name; // Dynamic table name based on page_name

        // Check if the model for this table already exists, or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            // Fetch the fields to dynamically build the schema if it doesn't exist
            const fields = await Field.find({ page_id: pageExist.id });
            let schemaFields = {};
            for (const field of fields) {
                const name = field.fields_name;
                const type = field.type;
                schemaFields[name] = { type: type };
            }

            // Add fixed fields to schema
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };
            schemaFields["status"] = { type: String }; // Add status to schema in case it's not present

            // Create the schema for the collection
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Update the status field in the document
        const updatedRecord = await DB.findByIdAndUpdate(
            id, 
            { status: status },  // Updating the status field
            { new: true }        // Return the updated document
        );

        if (!updatedRecord) {
            return res.status(404).json({
                error: "Not Found",
                details: "The record you're trying to update does not exist",
            });
        }

        res.status(200).json({
            msg: "Record updated successfully",
            updatedRecord,
        });
    } catch (error) {
        console.error("Error in updateStatus:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


const update = async (req, res) => {
    try {
        
        // Use multer to handle file uploads
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: "Multer Error", details: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Unknown Error", details: err });
            }

            const { user_id, page_name } = req.body;
           
            const id = req.params.id;
            
            // Check if user_id, page_name, and id are provided
            if (!user_id || !page_name || !id) {
                return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
            }

            // Find the page using the page_name and user_id
            // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
            const pageExist = await Page.findOne({ page_name: page_name});
            if (!pageExist) {
                return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
            }

            const table_name = pageExist.table_name; // Dynamic table name based on page_name
            const page_id = pageExist.id;

            // Fetch the fields for the dynamic form
            const fields = await Field.find({ page_id: page_id });

            let schemaFields = {};
            let updateData = {}; // Object to hold form data for updating

            // Map through fields to handle validation and data
            for (const field of fields) {
                const name = field.fields_name;
                const type = String;

                // Add field to schemaFields (used to dynamically create or fetch the model)
                schemaFields[name] = { type: type };

                // Validation check if required
                if (field.fields_validation === "yes" && field.fields_type !="file") {
                    if (!req.body.fields || !req.body.fields[name]) {
                        return res.status(400).json({
                            error: "Validation Error",
                            details: `Field '${name}' is required`,
                        });
                    }
                }

                // If field type is 'image', handle file upload only if a new image is uploaded
                if (field.fields_type === 'file') {
                    const imageField = req.files.find((file) => file.fieldname === `fields[${name}]`);

                    if (imageField) {
                        // If a new image is uploaded, update with the new filename
                        updateData[name] = imageField.filename;

                        // Optionally, delete the old image from the server (if necessary)
                        // const currentDocument = await DB.findById(id);
                        // if (currentDocument && currentDocument[name]) {
                        //     const oldImagePath = path.join(__dirname, 'public/adminmodules', currentDocument[name]);
                        //     fs.unlink(oldImagePath, (err) => {
                        //         if (err) console.log('Failed to delete old image:', err);
                        //     });
                        // }
                    } 
                    // If no new image is uploaded, don't update the image field
                } else {
                    // If it's not an image field, update with the new data from the form
                    updateData[name] = req.body.fields[name];
                }
            }

            // Add fixed fields to schema (if any)
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Fetch or create the model for the dynamic table
            let DB;
            if (mongoose.models[table_name]) {
                DB = mongoose.models[table_name];
            } else {
                const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
                DB = mongoose.model(table_name, dynamicSchema);
            }

            // Update the document in the database
            const updatedRecord = await DB.findByIdAndUpdate(id, updateData, { new: true });

            if (!updatedRecord) {
                return res.status(404).json({
                    error: "Not Found",
                    details: "The record you're trying to update does not exist",
                });
            }

            res.status(200).json({
                msg: "Record updated successfully",
                updatedRecord,
            });
        });
    } catch (error) {
        console.error("Error in update:", error); // Log the error
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getdata = async (req,res)=>{
    try {
        const { page_name } = req.body;
        const user_id = req.params.id;
       
        // Validate inputs
        if (!user_id || !page_name ) {
            return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
        }

        // Find the page using the page_name and user_id
        // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
        const pageExist = await Page.findOne({ page_name: page_name});
        if (!pageExist) {
            return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
        }

        const table_name = pageExist.table_name; // Dynamic table name based on page_name

        // Check if the model for this table already exists, or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            // Fetch the fields to dynamically build the schema if it doesn't exist
            const fields = await Field.find({ page_id: pageExist.id });
            let schemaFields = {};
            for (const field of fields) {
                const name = field.fields_name;
                const type = String;
                schemaFields[name] = { type: type };
            }

            // Add fixed fields to schema
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Create the schema for the collection
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Delete the record based on the id
        const fetchdata = await DB.find({ user_id: user_id });

        if (!fetchdata) {
            return res.status(404).json({
                error: "Not Found",
                details: "The record you're trying to delete does not exist",
            });
        }

        res.status(200).json({
            msg: fetchdata,
            
        });
    } catch (error) {
        console.error("Error in getdata:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}


const getdataByid = async (req,res)=>{
    try {
        const { page_name } = req.body;
        const id = req.params.id;
       
        // Validate inputs
        if (!id || !page_name ) {
            return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
        }

        // Find the page using the page_name and user_id
        // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
        const pageExist = await Page.findOne({ page_name: page_name});
        if (!pageExist) {
            return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
        }

        const table_name = pageExist.table_name; // Dynamic table name based on page_name

        // Check if the model for this table already exists, or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            // Fetch the fields to dynamically build the schema if it doesn't exist
            const fields = await Field.find({ page_id: pageExist.id });
            let schemaFields = {};
            for (const field of fields) {
                const name = field.fields_name;
                const type = String;
                schemaFields[name] = { type: type };
            }

            // Add fixed fields to schema
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Create the schema for the collection
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Delete the record based on the id
        const fetchdata = await DB.find({ _id: id });

        if (!fetchdata) {
            return res.status(404).json({
                error: "Not Found",
                details: "The record you're trying to delete does not exist",
            });
        }

        res.status(200).json({
            msg: fetchdata,
            
        });
    } catch (error) {
        console.error("Error in getdata:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

const getdataByidcat = async (req, res) => {
      const { tableName } = req.params;
      const { user_id } = req.body;
    try {
        // Dynamically query the database based on the table name

        let DynamicModel;
        if (mongoose.models[tableName]) {
          DynamicModel = mongoose.models[tableName];
        } else {
          DynamicModel = mongoose.model(tableName, new mongoose.Schema({}, { strict: false }), tableName);
        }
    
        const page = await DynamicModel.find({ user_id: user_id });


        
        // Query the dynamic collection
        if (page.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
          }
      
          res.status(200).json({
            msg:page,
    
        });
         
          // Send the response with the data
          
          if (!page) {
          return res.status(404).json({ error: 'Data not found' });
        }
    
        
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
}
};
// const getdataByidcatdd= async (req,res)=>{
//     try {

//         const id = req.params.id;
//         const page = await Page.find();
//         const pageExist = await Page.findOne({ page_name: page_name});

//         const table_name = page.table_name;
//         const page_id = pageExist.id;
//         res.status(200).json({
//             msg:page,
//             msg:table_name,
    
//         });
//     }catch(error){
//         console.error("Error in getall:", error.message); // Log the error message
//         res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
//     }



//     try {
//         const { page_name } = req.body;
       
       
//         // Validate inputs
//         if (!id || !page_name ) {
//             return res.status(400).json({ error: "Validation Error", details: "Missing required fields" });
//         }

//         // Find the page using the page_name and user_id
//         // const pageExist = await Page.findOne({ page_name: page_name, user_id: user_id });
//         const pageExist = await Page.findOne({ page_name: page_name});
//         if (!pageExist) {
//             return res.status(500).json({ error: "Page Error", details: "Page name doesn't exist" });
//         }

//         const table_name = pageExist.table_name; // Dynamic table name based on page_name

//         // Check if the model for this table already exists, or create a new one
//         let DB;
//         if (mongoose.models[table_name]) {
//             DB = mongoose.models[table_name];
//         } else {
//             // Fetch the fields to dynamically build the schema if it doesn't exist
//             const fields = await Field.find({ page_id: pageExist.id });
//             let schemaFields = {};
//             for (const field of fields) {
//                 const name = field.fields_name;
//                 const type = String;
//                 schemaFields[name] = { type: type };
//             }

//             // Add fixed fields to schema
//             schemaFields["user_id"] = { type: String };
//             schemaFields["createdDate"] = { type: Date };

//             // Create the schema for the collection
//             const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
//             DB = mongoose.model(table_name, dynamicSchema);
//         }

//         // Delete the record based on the id
//         const fetchdata = await DB.find({ _id: id });

//         if (!fetchdata) {
//             return res.status(404).json({
//                 error: "Not Found",
//                 details: "The record you're trying to delete does not exist",
//             });
//         }

//         res.status(200).json({
//             msg: fetchdata,
            
//         });
//     } catch (error) {
//         console.error("Error in getdata:", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// }
module.exports = {add, deletemodule, status, update, getdata,getdataByid,getdataByidcat};