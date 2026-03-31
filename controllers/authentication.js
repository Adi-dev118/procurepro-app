const db = require('./../config/db');
const bcrypt = require('bcrypt');
// helper function
// bycrypt password hashing
const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be atleast 8 Characters');
  }
};

// for checking user authentication
const checkPassword = async (userPassword, storedPassword) => {
  return await bcrypt.compare(userPassword, storedPassword);
};

// new user registration
exports.signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Please provide name, email and password',
      });
    }
    validatePassword(password);
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(`INSERT INTO users (name, password, email) VALUES (?, ?, ?)`, [
      name,
      hashedPassword,
      email,
    ]);
    res.status(200).json({
      status: 'Success',
      message: 'User successfully created',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

// login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Please provide email and password',
      });
    }
    const [row] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.password, s.id AS vendorId FROM users u LEFT JOIN suppliers s ON u.id = s.user_id WHERE email = ?`,
      [email],
    );
    if (row.length === 0) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Invalid email or password',
      });
    }

    const user = row[0];
    const isCorrect = await checkPassword(password, user.password);
    if (!isCorrect) {
      throw new Error('Invalid email or password');
    }

    const sessionId = { id: user.id, name: user.name, role: user.role, vendorId: user.vendorId };
    const session = (req.session.user = sessionId);
    // console.log(session);

    res.status(200).json({
      status: 'Success',
      message: 'Successfully Logged In',
      session,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Logout failed',
      });
    }

    res.clearCookie('connect.sid');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) return res.status(403).send('Unauthorized');
    if (!roles.includes(req.session.user.role)) return res.status(403).send('Unauthorized');

    next();
  };
};

// exports.protect = (req, res, next) => {
//   if (req.session.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).send('Unauthorized');
//   }
// };
