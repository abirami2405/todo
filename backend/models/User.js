

const mongoose = require('mongoose');  // ADD THIS LINE

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true  // Allow null values
  },
  facebookId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    enum: ['google', 'facebook', 'github', 'local'],
    required: true
  }
}, {
  timestamps: true
});

// Add compound unique indexes
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ facebookId: 1 }, { unique: true, sparse: true });
userSchema.index({ githubId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
