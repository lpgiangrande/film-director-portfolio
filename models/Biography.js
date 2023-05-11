const mongoose = require('mongoose');

const biographySchema = new mongoose.Schema({
  bioText: {
    type: String,
    required: true
  },
  /*
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
  */
});

//const Biography = mongoose.model('Biography', biographySchema);

//module.exports = Biography;

module.exports = mongoose.model('Biography', biographySchema);