const mongoose = require("mongoose");


const DonorSchema = new mongoose.Schema({
    _id : {
        type : String,
    },
    email : {
        type      : String,
        maxLength : 40
    },
});

