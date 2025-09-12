import Biography from '../models/Biography.js';

/**
 * Render the form to update the biography (admin view)
 */
export const updateBiography = async (req, res, next) => {
  try {
    const biography = await Biography.findOne().exec();

    if (!biography) {
      console.log('Biography not found');
      return res.status(404).send('Biography entry not found');
    }

    res.render('updateAbout', { biography });
  } catch (err) {
    console.error('Error retrieving biography:', err);
    next(err);
  }
};

/**
 * Handle the submission of updated biography
 */
export const handleBiographyUpdate = async (req, res, next) => {
  try {
    const { pic, text, email } = req.body;

    const biography = await Biography.findOne().exec();

    if (!biography) {
      return res.status(404).send('Biography entry not found');
    }

    biography.pic = pic;
    biography.text = text;
    biography.email = email;

    await biography.save();

    req.flash('success_msg', 'Biography updated successfully');
    res.redirect('/admin/list');
  } catch (err) {
    console.error('Error updating biography:', err);
    next(err);
  }
};
