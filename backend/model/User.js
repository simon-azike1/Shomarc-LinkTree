const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'link'
  },
  message: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  avatarUrl: {
    type: String,
    trim: true,
    default: ''
  },
  links: [linkSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
