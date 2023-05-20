import mongoose from 'mongoose';

const biographySchema = new mongoose.Schema({
  bioImg: {
    type: String,
    required: true
  },
  bioText: {
    type: mongoose.Schema.Types.Text,
    required: true
  },
  bioEmail: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Biography', biographySchema);





  /*
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
  */