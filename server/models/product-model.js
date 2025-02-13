const {Schema, model} = require("mongoose");

const productcategorySchema = new Schema({
    name: {type: String, required: true},
    url: {type: String},
    status:{type: String},

});
const Productcategory = new model('Productcategory',productcategorySchema);


const productSubcategorySchema = new Schema({
    name: {type: String, required: true},
    url: {type: String},
    status:{type: String},

});
const Productsubcategory = new model('Productsubcategory',productSubcategorySchema);

const PaymentOptionsSchema = new Schema({
    name: {type: String, required: true},
    days: {type: String, required: true},
    url: {type: String},
    status:{type: String},

});
const PaymentOptions = new model('PaymentOptions',PaymentOptionsSchema);

const productSchema = new Schema({
    name: {type: String, required: true},
    category_id:{type: String, required: true},
    featuredimage:{type: String, required: true},
    mainimage:{type: String, required: true},
    briefintro:{type: String, required: true},
    details:{type: String, required: true},
    price:{type: String, required: true},
    url: {type: String},
    status:{type: String},
    metatitle:{type: String},
    metadescp:{type: String},
    metakey:{type: String},
    canonicalurl:{type: String},
    altfeatured:{type: String},
    altmain:{type: String},
    schemacode:{type: String},

});

//product feature

const ProductFeatureSchema = new Schema({
    name: {type: String, required: true},
    actualinr: {type: String},
    discountedinr: {type: String},
    actualusd: {type: String},
    discountedusd: {type: String},
    category: {type: String},
    details: {type: String},
    createdDate: {type: String},
    createdby: {type: String},
    status:{type: String},

});
const ProductFeature = new model('ProductFeature',ProductFeatureSchema);

//Addons
const ProductAddonSchema = new Schema({
    name: {type: String, required: true},
    details: {type: String, required: true},
    question: {type: String, required: true},

    url: {type: String},
    status:{type: String},

});
const ProductAddon = new model('ProductAddon',ProductAddonSchema);
const Product = new model('Product',productSchema);


module.exports = {Productcategory,Productsubcategory,PaymentOptions,ProductFeature,ProductAddon, Product};



