import mongoose from 'mongoose';

export const userSchema: mongoose.Schema = new mongoose.Schema({
  username: {
    type: String,
    require: false,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
  },
  location: {
    type: String,
    require: false,
  },
  biography: {
    type: String,
    require: false,
    maxlength: 500,
  },
  profilePicture: {
    type: String,
    require: false,
  },
  dateOfBirth: {
    type: Date,
    require: false,
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

export const User = mongoose.model('User', userSchema);
