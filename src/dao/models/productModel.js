import mongoose from "mongoose";

const productCollection = "productos";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    thumbnail: {
        type: Array,
        default: [],
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    status: Boolean,
    category: {
        type: String,
        required: true,
    },
});

export const productModel = mongoose.model(productCollection, productSchema);
