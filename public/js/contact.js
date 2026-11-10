// Builds the developer contact link in the footer.
// The email is split in two parts so it never appears in the HTML source,
// which keeps it away from simple bots that harvest addresses for spam.
const devContact = document.getElementById('dev-contact');

if (devContact) {
  const user = 'lauragiangrande';
  const domain = 'protonmail.com';
  devContact.href = 'mailto:' + user + '@' + domain;
}
