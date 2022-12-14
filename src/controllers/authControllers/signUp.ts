import type { RequestHandler } from 'express';
import * as bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { repositorys } from '../../db';
import { User } from '../../db/entities/User';

import errorsMessage from '../../utils/errorsMessage';
import { customError } from '../../utils/createCustomError';
import { generateToken } from '../../utils/generateToken';
import succsessMessage from '../../utils/succsessMessage';

type ParamsType = Record<string, never>;

type ResponseType = {
  user: User;
  token: string;
  message: string;
};

type BodyType = {
  email: string;
  password: string;
};

type QueryType = Record<string, never>;

type HandlerType = RequestHandler<ParamsType, ResponseType, BodyType, QueryType>;

export const signUp:HandlerType = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkUniq = await repositorys.userRepository.findOneBy({ email });
    if (checkUniq) {
      throw customError(StatusCodes.BAD_REQUEST, errorsMessage.EMAIL_USED);
    }

    const user = new User();
    user.email = email;
    user.password = bcrypt.hashSync(password, 5);

    await repositorys.userRepository.save(user);
    const token = generateToken(user.id);
    delete user.password;

    return res.json({ user, token, message: succsessMessage.REGISTRATION_SUCCESS });
  } catch (err) {
    next(err);
  }
};
