import mongoose from "mongoose";

export type UserRole = "SuperAdmin" | "regularUser";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: false, default: "regularUser" },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
  },
  { autoIndex: true }
);

userSchema.pre("save", async function (next) {
  const user = this as mongoose.Document & { id: string };
  const existingUser = await mongoose.models.User.findOne({ id: user.id });
  if (existingUser) {
    const error = new mongoose.Error.ValidationError();
    error.addError("id", new mongoose.Error.ValidatorError({ message: "El ID ya está en uso" }));
    return next(error);
  }

  next();
});

export interface UserInput {
  name: string;
  email: string;
  password: string;
  id: string;
  role: UserRole;
}

export interface UserDocument extends UserInput, mongoose.Document {
  id: string;
}

export const UserModel = mongoose.model<UserInput>("User", userSchema);

