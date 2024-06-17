import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

userSchema.virtual("avatarUrl").get(function () {
  if (this.avatar) {
    return `data:image/jpeg;base64,${this.avatar.toString("base64")}`;
  }
  return null;
});

const User = mongoose.model("User", userSchema);

export default User;
