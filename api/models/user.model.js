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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } // Ensure virtuals are included
);

userSchema.virtual("avatarUrl").get(function () {
  console.log("Avatar buffer:", this.avatar);
  if (this.avatar && this.avatar.length > 0) {
    return `data:image/jpeg;base64,${this.avatar.toString("base64")}`;
  }
  return null;
});

const User = mongoose.model("User", userSchema);

export default User;
