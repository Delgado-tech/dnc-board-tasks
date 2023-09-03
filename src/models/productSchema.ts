import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descripton: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const productSchema = mongoose.models.Product || mongoose.model("Product", schema);
export default productSchema;