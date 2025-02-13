const { Schema, model } = require("mongoose");
//Fixed item master
const fixedItemSchema = new Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    url: { type: String },
    status: { type: String },
    actualinr: { type: String },
    membersinr: { type: String },
    brcoinsinr: { type: String },
    actualusd: { type: String },
    membersusd: { type: String },
    brcoinsusd: { type: String },

});


const FixedItem = new model('FixedItem', fixedItemSchema);
//Addons
const addonsSchema = new Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    quantity: { type: String, required: true },
    template: { type: String, required: true },
    url: { type: String },
    status: { type: String },
    actualinr: { type: String },
    membersinr: { type: String },
    brcoinsinr: { type: String },
    actualusd: { type: String },
    membersusd: { type: String },
    brcoinsusd: { type: String },

});

const Addons = new model('Addons', addonsSchema);

//package

//Addons
const packageSchema = new Schema({
    name: { type: String, required: true },
    task: { type: String, required: true },
    features: { type: String },  // Store as a single string (comma-separated)
    url: { type: String },
    status: { type: String },
    actualinr: { type: String },
    membersinr: { type: String },
    brcoinsinr: { type: String },
    actualusd: { type: String },
    membersusd: { type: String },
    brcoinsusd: { type: String },

});

const Package = new model('Package', packageSchema);


const packageItemSchema = new Schema({
    itemname: { type: String },

    itemid: { type: String },
    packageid: { type: String },
    actualinrpackage: { type: String },
    membersinrpackage: { type: String },
    brcoinsinrpackage: { type: String },
    actualusdpackage: { type: String },
    membersusdpackage: { type: String },
    brcoinsusdpackage: { type: String },
   

});

const PackageItem = new model('PackageItem', packageItemSchema);

module.exports = { FixedItem, Addons, Package,PackageItem };



