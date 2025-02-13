const {Schema, model} = require("mongoose");

const productcategorySchema = new Schema({
    name: {type: String, required: true},
    url: {type: String},
    status:{type: String},

});
const Productcategory = new model('Productcategory',productcategorySchema);

const productSchema = new Schema({
    title: {type: String, required: true},
    category_id:{type: String, required: true},
    date:{type: String, required: true},
    featuredimage:{type: String, required: true},
    mainimage:{type: String, required: true},
    briefintro:{type: String, required: true},
    details:{type: String, required: true},
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
const Product = new model('Product',productSchema);


module.exports = {Productcategory, Product};



