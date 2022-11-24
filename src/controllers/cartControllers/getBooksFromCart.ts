import type { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { repositorys } from '../../db';
import { customError } from '../../utils/error/customError';
import { CART_IS_EMPTY } from '../../utils/error/errorsText';

export const getBooksFromCart:Handler = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const cart = await repositorys.cartRepository
      .createQueryBuilder('cart')
      .where('cart.userId = :userId', { userId })
      .leftJoinAndSelect('cart.book', 'book')
      .getMany();

    if (!cart) {
      throw customError(StatusCodes.NOT_FOUND, CART_IS_EMPTY);
    }

    return res.json({ cart });
  } catch (err) {
    next(err);
  }
};
