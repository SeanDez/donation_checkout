const mongoose = require("mongoose");

// for donors and referees
const EmailSchema = new mongoose.Schema({
    donor_id : {
        type : String,
    },
    is_referred : {
        type : Boolean,
        default: false
    },
    first_name : {
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

