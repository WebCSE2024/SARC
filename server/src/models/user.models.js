import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { UserType } from "../../../../shared/types/user.type.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  username: {
    type: String,
    index: true,
    required: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    // enum: Object.values(UserType),
    required: true,
  },
  // Fields specific to user types
  professorDetails: {
    googleScholarLink: String,
    position: String,
  },
  studentDetails: {
    gradYear: Number,
    admissionNumber: String,
    degree: {
      type: String,
      enum: ["B.Tech", "M.Tech", "PhD", "Other"],
    },
  },
  alumniDetails: {
    gradYear: Number,
    linkedInProfile: String,
  },
  // Token management
  activationToken: {
    type: String,
  },
  activationExpires: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["local", "google", "github", "linkedin"],
    default: "local",
  },
  providerId: {
    type: String,
    default: null,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = new mongoose.model("User", UserSchema);

// // Encrypt password using bcrypt
// UserSchema.pre("save", async function (next) {
//   // Update the timestamp
//   this.updatedAt = Date.now();

//   // Only hash the password if it's modified (or new)
//   if (!this.isModified("password")) {
//     return next();
//   }

//   // Skip password hashing if using OAuth
//   if (this.provider !== "local" && !this.password) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Schema validation middleware
// UserSchema.pre("validate", function (next) {
//   if (this.userType === UserType.STUDENT && !this.studentDetails.gradYear) {
//     this.invalidate(
//       "studentDetails.gradYear",
//       "Graduation year is required for students"
//     );
//   }

//   if (this.userType === UserType.ALUMNI && !this.alumniDetails.gradYear) {
//     this.invalidate(
//       "alumniDetails.gradYear",
//       "Graduation year is required for alumni"
//     );
//   }

//   next();
// });

// // Sign JWT and return
// UserSchema.methods.getSignedJwtToken = function () {
//   return jwt.sign(
//     {
//       id: this._id,
//       userType: this.userType,
//       username: this.username,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRE,
//     }
//   );
// };

// // Match user entered password to hashed password in database
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Generate activation token
// UserSchema.methods.generateActivationToken = function () {
//   const token = crypto.randomBytes(32).toString("hex");

//   this.activationToken = token;
//   this.activationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

//   return token;
// };

// // Generate password reset token
// UserSchema.methods.generateResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.resetPasswordToken = resetToken;
//   this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

//   return resetToken;
// };

// // Static methods
// UserSchema.statics.findByCredentials = async function (username, password) {
//   const user = await this.findOne({ username: username.toLowerCase() }).select(
//     "+password"
//   );

//   if (!user) {
//     return null;
//   }

//   const isMatch = await user.matchPassword(password);
//   if (!isMatch) {
//     return null;
//   }

//   return user;
// };

