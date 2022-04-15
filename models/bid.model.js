const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;