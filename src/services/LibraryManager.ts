import { Book } from '../models/Book';
import { User } from '../models/User';
import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';
import { generateId } from '../utils/idGenerator';
import { Library } from './Library';
import { NotificationService } from './NotificationService';
import { Storage } from './Storage';

export const MAX_BORROWED_BOOKS = 3;

const BOOKS_KEY = 'books';
const USERS_KEY = 'users';

export interface NewBookData {
  title: string;
  author: string;
  year: number;
}

export interface NewUserData {
  name: string;
  email: string;
}

export class LibraryManager {
  private readonly books: Library<Book>;
  private readonly users: Library<User>;

  constructor(
    private readonly storage: Storage,
    private readonly notifications: NotificationService,
  ) {
    const savedBooks = this.storage.load<IBook[]>(BOOKS_KEY);
    const savedUsers = this.storage.load<IUser[]>(USERS_KEY);
    this.books = new Library<Book>(
      Array.isArray(savedBooks) ? savedBooks.map((data) => Book.fromJSON(data)) : [],
    );
    this.users = new Library<User>(
      Array.isArray(savedUsers) ? savedUsers.map((data) => User.fromJSON(data)) : [],
    );
  }

  getBooks(): Book[] {
    return this.books.getAll();
  }

  getUsers(): User[] {
    return this.users.getAll();
  }

  addBook(data: NewBookData): Book {
    const book = new Book(generateId(), data.title.trim(), data.author.trim(), data.year);
    this.books.add(book);
    this.save();
    return book;
  }

  addUser(data: NewUserData): User {
    const user = new User(generateId(), data.name.trim(), data.email.trim());
    this.users.add(user);
    this.save();
    return user;
  }

  removeBook(id: string): boolean {
    const book = this.books.getById(id);
    if (!book) return false;
    if (book.isBorrowed) {
      this.notifications.error(`${book} is currently borrowed and cannot be deleted.`);
      return false;
    }
    this.books.remove(id);
    this.save();
    return true;
  }

  removeUser(id: string): boolean {
    const user = this.users.getById(id);
    if (!user) return false;
    if (this.countBorrowedBy(id) > 0) {
      this.notifications.error(`${user} still has borrowed books and cannot be deleted.`);
      return false;
    }
    this.users.remove(id);
    this.save();
    return true;
  }

  searchBooks(query: string): Book[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return this.books.getAll();
    return this.books.find(
      (book) =>
        book.title.toLowerCase().includes(normalized) ||
        book.author.toLowerCase().includes(normalized),
    );
  }

  countBorrowedBy(userId: string): number {
    return this.books.find((book) => book.borrowedBy === userId).length;
  }

  borrowBook(bookId: string, userId: string): boolean {
    const book = this.books.getById(bookId);
    if (!book) {
      this.notifications.error('Book not found.');
      return false;
    }
    if (book.isBorrowed) {
      this.notifications.error(`${book} is already borrowed.`);
      return false;
    }
    const user = this.users.getById(userId);
    if (!user) {
      this.notifications.error(`User with ID ${userId} not found.`);
      return false;
    }
    if (this.countBorrowedBy(userId) >= MAX_BORROWED_BOOKS) {
      this.notifications.error(
        `${user} cannot borrow more than ${MAX_BORROWED_BOOKS} books at the same time.`,
      );
      return false;
    }

    book.borrow(user.id);
    this.save();
    this.notifications.success(`${book} has been borrowed by ${user}.`);
    return true;
  }

  returnBook(bookId: string): boolean {
    const book = this.books.getById(bookId);
    if (!book || !book.isBorrowed) {
      this.notifications.error('This book is not borrowed.');
      return false;
    }

    book.giveBack();
    this.save();
    this.notifications.success(`${book} has been returned.`, 'Закрити');
    return true;
  }

  private save(): void {
    this.storage.save(BOOKS_KEY, this.books.getAll());
    this.storage.save(USERS_KEY, this.users.getAll());
  }
}
