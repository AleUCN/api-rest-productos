const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  const validUsername = 'admin';
  const validPassword = 'admin';

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const payload = {
    username: validUsername
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' }); // 60 días

  res.status(200).json({ token });
};
