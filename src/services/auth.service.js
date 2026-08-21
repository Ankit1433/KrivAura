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

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepository.getUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await authRepository.updatePassword(userId, hashedPassword);

  return true;
};

module.exports = { register, login, changePassword };
