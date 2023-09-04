import mongoose from 'mongoose';

export type userAcessLevel = "admin" | "default";

const schema =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    acessLevel: {
        type: String,
        required: true,
        select: false
    }
}, {
    timestamps: true
});

const userSchema = mongoose.models.User || mongoose.model("User", schema);
export default userSchema;