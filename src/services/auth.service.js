const authRepository = require('../repositories/auth.repository');
const messages = require('../constants/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (user) => {
  const existingUser = await authRepository.finduserByEmail(user.email);
  if (existingUser) {
    throw new Error(messages.EMAIL_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const userToCreate = {
    ...user,
    password: hashedPassword,
  };

  const newUser = await authRepository.register(userToCreate);

  return newUser;
};

const login = async ({ email, password }) => {
  const user = await authRepository.finduserByEmail(email);
  if (!user) {
    throw new Error(messages.INVALID_CREDENTIALS, 401);
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error(messages.INVALID_CREDENTIALS, 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  delete user.password; // Remove password from the user object before returning

  return { user, token };
};

module.exports = { register, login };
