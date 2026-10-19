const authRepository = require('../repositories/auth.repository');

const messages = require('../constants/message');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const AppError = require('../utils/AppError');

const googleClient = new OAuth2Client();

const createToken = (user) =>
  jwt.sign(
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
  const isPasswordCorrect =
    Boolean(user.password) && (await bcrypt.compare(password, user.password));

  if (!isPasswordCorrect) {
    throw new AppError(messages.INVALID_CREDENTIALS, 401);
  }

  const token = createToken(user);

  // Never return password
  delete user.password;

  return {
    user,
    token,
  };
};

const loginWithGoogle = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new AppError('Google sign-in is not configured', 503);
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new AppError('Invalid or expired Google credential', 401);
  }

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new AppError('Google did not provide a verified email address', 401);
  }

  let user;
  try {
    user = await authRepository.findOrCreateGoogleUser({
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      fullName: (payload.name || payload.email.split('@')[0]).slice(0, 100),
    });
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('This Google account cannot be linked to another user', 409);
    }
    throw error;
  }

  if (!user) {
    throw new AppError('This email is already linked to another Google account', 409);
  }

  return {
    user,
    token: createToken(user),
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

  if (!user.password) {
    throw new AppError('This account uses Google sign-in and has no password to change', 400);
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
  loginWithGoogle,
  changePassword,
};
