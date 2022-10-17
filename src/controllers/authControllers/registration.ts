import * as bcrypt from 'bcryptjs';
import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EMAIL_USED } from '../../utils/error/errorsText';
import { User } from '../../db/entitys/User';
import { repositorys } from '../../db';
import { customError } from '../../utils/error/customError';
import { generateToken } from '../../utils/tokenGenerator';
import { config } from '../../config';

export const registrationUser:Handler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkUniq = await repositorys.userRepository.findOneBy({ email });
    if (checkUniq) {
      throw customError(StatusCodes.BAD_REQUEST, EMAIL_USED);
    }

    const user = new User();
    user.email = email;
    user.password = bcrypt.hashSync(password, 5);

    await repositorys.userRepository.save(user);
    const token = generateToken(user.id);
    delete user.password;

    return res.json({ user, token, message: config.apiMessage.REGISTRATION_SUCCESS });
  } catch (err) {
    next(err);
  }
};
