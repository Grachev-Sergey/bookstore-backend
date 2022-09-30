import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { customError } from '../utils/error/customError';
import { INVALID_TOKEN, NOT_AUTHORIZED, NOT_REGISTRED } from '../utils/error/errorsText';
import { repositorys } from '../db';

export const tokenVerification: Handler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw customError(StatusCodes.FORBIDDEN, NOT_AUTHORIZED);
    }

    const payload = jwt.verify(token, config.token.secretKey) as { id: number };
    const existingUser = await repositorys.userRepository.findOneBy({ id: payload.id });
    if (!existingUser) {
      throw customError(StatusCodes.FORBIDDEN, NOT_REGISTRED);
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(
        customError(StatusCodes.FORBIDDEN, INVALID_TOKEN),
      );
    }
    next(err);
  }
};
