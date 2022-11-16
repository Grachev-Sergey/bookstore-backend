import { AppDataSource } from './data-source';
import { Book } from './entitys/Book';
import { Comment } from './entitys/Comments';
import { Favorite } from './entitys/Favorite';
import { Genre } from './entitys/Genre';
import { Rating } from './entitys/Rating';
import { User } from './entitys/User';

export const repositorys = {
  userRepository: AppDataSource.getRepository(User),
  bookRepository: AppDataSource.getRepository(Book),
  genreRepository: AppDataSource.getRepository(Genre),
  ratingRepository: AppDataSource.getRepository(Rating),
  favoriteRepository: AppDataSource.getRepository(Favorite),
  commentRepository: AppDataSource.getRepository(Comment),
};
