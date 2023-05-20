import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
//        type: Array,
//        default: [],
         type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    },
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
//const cartModel = mongoose.model(cartCollection, cartSchema);
//export default cartModel;