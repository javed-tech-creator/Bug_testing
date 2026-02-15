import { Schema,model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  age: Number
},
{
    timestamps:true
}
);

const testModel= model("TestEXcel", userSchema);

export default testModel;
