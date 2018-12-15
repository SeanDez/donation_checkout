const mongoose = require("mongoose");

// for donors and referees
const EmailSchema = new mongoose.Schema({
    donorId : {
        type : String,
    },
    isReferred : {
        type : Boolean,
        default: false
    },
    firstName : {
        type : String,
        maxLength : 20
    },
    email : {
        type      : String,
        maxLength : 40
    },
});

const EmailModel = mongoose.model("donation_checkout_email", EmailSchema);
module.exports = EmailModel;

