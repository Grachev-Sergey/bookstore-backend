import type { Handler } from 'express';
import { repositorys } from '../../db';
import { config } from '../../config';
import { Book } from '../../db/entitys/Book';

export const addBook:Handler = async (req, res, next) => {
  try {
    const {
      cover,
      title,
      author,
      description,
      dateOfIssue,
      genre,
      hardCoverPrice,
      paperback,
      aperbackPrice,
      status,
    } = req.body;

    const book = new Book();
    book.cover = cover;
    book.title = title;
    book.author = author;
    book.description = description;
    book.dateOfIssue = dateOfIssue;
    book.genre = genre;
    book.hardCoverPrice = hardCoverPrice;
    book.paperback = paperback;
    book.aperbackPrice = aperbackPrice;
    book.status = status;

    await repositorys.bookRepository.save(book);
    return res.json({ message: config.apiMessage.BOOK_ADDED });
  } catch (err) {
    next(err);
  }
};