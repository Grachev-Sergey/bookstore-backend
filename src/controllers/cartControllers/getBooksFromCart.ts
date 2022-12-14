import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { Cart } from '../../db/entities/Cart';
import { repositorys } from '../../db';

import { customError } from '../../utils/createCustomError';
import errorsMessage from '../../utils/errorsMessage';

type ParamsType = Record<string, never>;

type ResponseType = {
  cart: Cart[];
};

type BodyType = Record<string, never>;

type QueryType = {
  userId: string;
};

type HandlerType = RequestHandler<ParamsType, ResponseType, BodyType, QueryType>;

export const getBooksFromCart:HandlerType = async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const cart = await repositorys.cartRepository
      .createQueryBuilder('cart')
      .where('cart.userId = :userId', { userId })
      .leftJoinAndSelect('cart.book', 'book')
      .getMany();

    if (!cart) {
      throw customError(StatusCodes.NOT_FOUND, errorsMessage.CART_IS_EMPTY);
    }

    return res.json({ cart });
  } catch (err) {
    next(err);
  }
};
