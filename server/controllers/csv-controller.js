const fs= require('fs');
const path = require('path');
const csv = require('csvtojson');
const Csv = require("../models/csv-model");
const { response } = require('express');

const create = async (req,res) =>{
    // console.log(req.file);
     const filedata = [];
    try {
        csv()
        .fromFile(req.file.path) 
        .then(async(response) => {
            for(var x=0;  x < response.length; x++ ){
                if(response[x].username != ''){
                    filedata.push({
                        username:response[x].username,
                        email:response[x].email,
                        mobile:response[x].mobile,
                    });
                }
            }  
            await Csv.insertMany(filedata);
        })       
        res.status(200).json('success');
    } catch (error) {
        res.status(400).json(error);
    }
}
module.exports = {create};