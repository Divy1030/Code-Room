import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6,'Email must be at least 6 characters long'],
        maxLength:[255,'Email must be at most 255 characters long']
    },
    password:{
        type:String,
        required:true,
        select:false,
        minLength:[8,'Password must be at least 8 characters long'],
        maxLength:[100,'Password must be at most 100 characters long']
    }
})

userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.validatePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateJWT = function() {
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};


const User=mongoose.model('User',userSchema);

export default User;