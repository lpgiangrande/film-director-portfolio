import mongoose from 'mongoose';

const biographySchema = new mongoose.Schema(
  {
    //_id: mongoose.Schema.Types.ObjectId,
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

export default Biography;



/*
email: {
  type: String,
  required: true,
  unique: true, 
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
*/