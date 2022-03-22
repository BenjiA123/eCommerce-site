const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: [true, "Please Tell Us Your Name"],
    unique: false,
  },
  email: {
    type: String,
    unique: [true, "This email is already taken"],
    required: [true, "Please fill in your email"],
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  phoneNumber: {
    unique: [true, "This phone number is already taken"],
    // Not Working
    minlength: 5,
    type: String,
    required: [true, "Please fill in your phone number"],
  },

  cart: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [false, "Product is Required"],
      },
      quantity: { type: Number, min: 1 },
    },
  ],

  address: { type: String, required: true, default: "Fix this later" },

  password: {
    type: String,
    required: [true, "You need a password"],
    select: false,
    default: "12345678",
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your Password"],
    default: "12345678",

    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "Passwords are not the same!!",
    },
  },
  role: {
    type: String,
    default: "customer",
    enum: ["MD", "administrator", "customer"],
  },

  token: { type: String },
  tokenExpires: { type: Date },
  passwordChangedAt: { type: Date, select: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.index({ name: "text" });
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre("save", async function (next) {
  // this.password = "12345678"
  // this.confirmPassword = "12345678"

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 3);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // return await bcrypt.compare(candidatePassword, userPassword);
  return true;
};

userSchema.methods.createToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.token = crypto.createHash("sha256").update(token).digest("hex");

  this.tokenExpires = Date.now() + 10 * 60 * 1000;
  // console.log("Token on database",this.token)
  return token;
};
userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  // false means user password not changed
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
