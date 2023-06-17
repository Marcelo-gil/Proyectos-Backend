import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        //required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        //required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        //required: true
    },
    role: {
        type: String,
        //required: true,
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