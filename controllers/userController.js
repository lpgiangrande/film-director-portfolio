import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MAX_USERS = 2;

// The form shows the existing accounts, and replaces the fields with a message when the maximum is reached
const renderForm = async (res, data = {}) => {
  const users = await User.find({}, 'username').sort({ date: 1 }).exec();
  res.render('register', { users, maxUsers: MAX_USERS, ...data });
};

// /admin/register : account creation form (only reachable when logged in)
export const registerPage = async (req, res) => {
  try {
    await renderForm(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fetching users');
  }
};

// Create an admin account. Passwords are not sent back to the form on error: they have to be typed again
export const handleRegistration = async (req, res) => {
  try {
    const { username, pwd, pwd2 } = req.body;
    const errors = [];

    // Maximum reached: the page explains it, nothing to validate
    if (await User.countUsers() >= MAX_USERS) return renderForm(res);

    // typeof checks: a crafted request can send objects/arrays instead of text
    const filled = [username, pwd, pwd2].every(value => typeof value === 'string' && value.trim() !== '');
    if (!filled) errors.push({ msg: 'Fields should not be empty' });
    else if (pwd !== pwd2) errors.push({ msg: 'Passwords do not match' });
    else if (pwd.length < 6) errors.push({ msg: 'Password should be at least 6 characters' });

    if (errors.length === 0 && await User.findOne({ username }).exec()) {
      errors.push({ msg: 'User already registered' });
    }

    if (errors.length > 0) {
      return renderForm(res, { errors, username: typeof username === 'string' ? username : '' });
    }

    const hashedPwd = await bcrypt.hash(pwd, 10);
    await new User({ username, pwd: hashedPwd }).save();

    req.flash('success_msg', `Compte « ${username} » créé.`);
    res.redirect('/admin/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while registering user');
  }
};
