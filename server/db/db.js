import mongoose from "mongoose";

function connect (){
    mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB', err));
}

export default connect;