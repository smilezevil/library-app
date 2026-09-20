import { IUser } from './interfaces/IUser';

export class User implements IUser {
  private readonly _id: string;
  private _name: string;
  private _email: string;

  constructor(id: string, name: string, email: string) {
    this._id = id;
    this._name = name;
    this._email = email;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  toJSON(): IUser {
    return { id: this._id, name: this._name, email: this._email };
  }

  static fromJSON(data: IUser): User {
    return new User(data.id, data.name, data.email);
  }

  toString(): string {
    return `${this._id} ${this._name} (${this._email})`;
  }
}
