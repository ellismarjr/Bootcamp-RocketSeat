import jwt from 'jsonwebtoken';

// sha-256: meetapp1026${20-09}

import User from '../models/User'

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, '0a74e76b157911e6534188011bfbbb16320657f02063bec5813fa4cd094c6216', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController()
