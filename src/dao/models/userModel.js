import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'USER'
    },
    carts: {
        type: [
            {
                cart:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts',
                }
            }
        ],
        default: []
    }
});

userSchema.pre('find',function () {
    this.populate('carts.cart');
});

userSchema.pre("findOne", function () {
    this.populate("carts.cart");
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;