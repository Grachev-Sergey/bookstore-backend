import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import { config } from '../config';
import { repositorys } from '../db';

import { customError } from '../utils/createCustomError';
import errorMessage from '../utils/errorsMessage';

export const verifyToken: Handler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw customError(StatusCodes.UNAUTHORIZED, errorMessage.NOT_AUTHORIZED);
    }

    const payload = jwt.verify(token, config.token.secretKey) as { id: number };
    const existingUser = await repositorys.userRepository.findOneBy({ id: payload.id });
    if (!existingUser) {
      throw customError(StatusCodes.UNAUTHORIZED, errorMessage.NOT_REGISTRED);
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(
        customError(StatusCodes.UNAUTHORIZED, errorMessage.INVALID_TOKEN),
      );
    }
    next(err);
  }
};
