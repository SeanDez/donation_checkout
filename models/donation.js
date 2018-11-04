const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    donor_id        : {
        type     : String,
        required : true
    },
    donation_amount : {
        type     : Number,
        required : true
    }
};

const DonationModel = mongoose.model("donation_checkout_donation", DonationSchema);
module.exports = DonationModel;

