const mongoose = require('mongoose');


const biographySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    pic: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { collection: 'biography' } // Ajout de l'option collection pour spécifier le nom de la collection
);

const Biography = mongoose.model('Biography', biographySchema);

module.exports = Biography;




// const mongoose = require('mongoose');

// const biographySchema = new mongoose.Schema({
//   bioImg: {
//     type: String,
//     required: true
//   },
//   bioText: {
//     type: String,
//     required: true
//   },
//   bioEmail: {
//     type: String,
//     required: true
//   }
// }, { collection: 'biography' });

// module.exports = mongoose.model('Biography', biographySchema);





  /*
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
  */