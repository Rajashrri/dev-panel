const {Schema, model} = require("mongoose");

const csvSchema = new Schema({
    username: {type: String,},
    email: {type: String,},
    mobile: {type: String,},
});
const Csv = new model('Csv',csvSchema);
module.exports = Csv;