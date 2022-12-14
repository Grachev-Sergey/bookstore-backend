import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { Book } from '../../db/entities/Book';
import { repositorys } from '../../db';
import { customError } from '../../utils/createCustomError';
import errorsMessage from '../../utils/errorsMessage';

type ParamsType = {
  bookId: string;
};

type ResponseType = {
  book: Book;
};

type BodyType = Record<string, never>;

type QueryType = Record<string, never>;

type HandlerType = RequestHandler<ParamsType, ResponseType, BodyType, QueryType>;

export const getOneBook: HandlerType = async (req, res, next) => {
  try {
    const bookId = Number(req.params.bookId);

    const book = await repositorys.bookRepository
      .createQueryBuilder('book')
      .where('book.id = :bookId', { bookId })
      .leftJoinAndSelect('book.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'user')
      .getOne();

    if (!book) {
      throw customError(StatusCodes.NOT_FOUND, errorsMessage.BOOK_NOT_FOUND);
    }

    return res.json({ book });
  } catch (err) {
    next(err);
  }
};
