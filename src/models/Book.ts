import { IBook } from './interfaces/IBook';

export class Book implements IBook {
  private readonly _id: string;
  private _title: string;
  private _author: string;
  private _year: number;
  private _isBorrowed: boolean;
  private _borrowedBy: string | null;

  constructor(
    id: string,
    title: string,
    author: string,
    year: number,
    isBorrowed = false,
    borrowedBy: string | null = null,
  ) {
    this._id = id;
    this._title = title;
    this._author = author;
    this._year = year;
    this._isBorrowed = isBorrowed;
    this._borrowedBy = borrowedBy;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
  }

  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }

  get isBorrowed(): boolean {
    return this._isBorrowed;
  }

  get borrowedBy(): string | null {
    return this._borrowedBy;
  }

  borrow(userId: string): void {
    if (this._isBorrowed) {
      throw new Error('Book is already borrowed');
    }
    this._isBorrowed = true;
    this._borrowedBy = userId;
  }

  giveBack(): void {
    this._isBorrowed = false;
    this._borrowedBy = null;
  }

  toJSON(): IBook {
    return {
      id: this._id,
      title: this._title,
      author: this._author,
      year: this._year,
      isBorrowed: this._isBorrowed,
      borrowedBy: this._borrowedBy,
    };
  }

  static fromJSON(data: IBook): Book {
    return new Book(data.id, data.title, data.author, data.year, data.isBorrowed, data.borrowedBy);
  }

  toString(): string {
    return `${this._title} by ${this._author} (${this._year})`;
  }
}
