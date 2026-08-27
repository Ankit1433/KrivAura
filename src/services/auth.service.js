const authRepository = require('../repositories/auth.repository');

const messages = require('../constants/message');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');

const register = async (user) => {
  const existingUser =
    await authRepository.findUserByEmailOrPhoneForRegister(
      user.email,
      user.phone,
    );

  if (existingUser) {
    if (existingUser.email === user.email) {
      throw new AppError(messages.EMAIL_EXISTS, 409);
    }

    if (existingUser.phone === user.phone) {
      throw new AppError('Phone number already exists', 409);
    }
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userToCreate = {
    ...user,
    password: hashedPassword,
  };

  const newUser = await authRepository.register(userToCreate);

  return newUser;
};

const login = async ({ login, password }) => {
  const user = await authRepository.findUserByEmailOrPhone(login);

  // User does not exist
  if (!user) {
    throw new AppError(messages.USER_NOT_EXISTS, 404);
  }

  // User exists but password is incorrect
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(messages.INVALID_CREDENTIALS, 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  // Never return password
  delete user.password;

  return {
    user,
    token,
  };
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await authRepository.getUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isMatch) {
    throw new AppError(
      'Current password is incorrect',
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10,
  );

  await authRepository.updatePassword(
    userId,
    hashedPassword,
  );

  return true;
};

module.exports = {
  register,
  login,
  changePassword,
};