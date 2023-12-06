import mongoose from 'mongoose';
import Biography from '../models/Biography.js';

// /admin/updateBiography : form for updating the biography (view)
export const updateBiography = (req, res) => {
    Biography.findOne({}).exec((err, biography) => {
      if (err) {
        console.log(err);
        return;
      } //console.log('Biography:', biography);
      res.render('updateAbout', { biography: biography });
    });
  };
  

// Submit updated biography
export const handleBiographyUpdate = async (req, res, next) => {
  try {
    const { pic, text, email } = req.body;

    const biography = await Biography.findOne();

    if (!biography) { // Handle case when no biography entry exists
      return res.status(404).send('Biography entry not found');
    }

    biography.pic = pic;
    biography.text = text;
    biography.email = email;

    await biography.save();

    req.flash('success_msg', 'Biography updated successfully');
    res.redirect(301, '/admin/list');

  } catch (error) {
    next(error);
  }
};
