const mongoose = require("mongoose");


const DonorSchema = new mongoose.Schema({
    first_name : {
        type : String,
        maxLength: 15
    },
    last_name : {
        type : String,
        maxLength: 25
    },
    email : {
        type : String,
        maxLength: 40
    },
    card_number : {
        type : String,
        length : 16,
    },
    card_expiration : {
        type : String,
        maxLength: 6
    }
});