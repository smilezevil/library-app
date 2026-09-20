import { FormErrors } from '../types';

export namespace Validation {
  export const REQUIRED_MESSAGE = "Це поле є обов'язковим";
  export const ID_MESSAGE = 'ID може містити лише цифри';
  export const YEAR_MESSAGE = 'Введіть коректний рік (наприклад, 1999)';
  export const EMAIL_MESSAGE = 'Введіть коректний email';

  const DIGITS_REGEX = /^\d+$/;
  const YEAR_REGEX = /^(1\d{3}|20\d{2})$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isDigitsOnly(value: string): boolean {
    return DIGITS_REGEX.test(value.trim());
  }

  export function isValidYear(value: string): boolean {
    const trimmed = value.trim();
    return YEAR_REGEX.test(trimmed) && Number(trimmed) <= new Date().getFullYear();
  }

  export function isValidEmail(value: string): boolean {
    return EMAIL_REGEX.test(value.trim());
  }

  export function validateUserId(id: string): string | null {
    if (!isRequired(id)) return REQUIRED_MESSAGE;
    if (!isDigitsOnly(id)) return ID_MESSAGE;
    return null;
  }

  export function validateBook(data: {
    title: string;
    author: string;
    year: string;
  }): FormErrors<'title' | 'author' | 'year'> {
    const errors: FormErrors<'title' | 'author' | 'year'> = {};
    if (!isRequired(data.title)) errors.title = REQUIRED_MESSAGE;
    if (!isRequired(data.author)) errors.author = REQUIRED_MESSAGE;
    if (!isRequired(data.year)) errors.year = REQUIRED_MESSAGE;
    else if (!isValidYear(data.year)) errors.year = YEAR_MESSAGE;
    return errors;
  }

  export function validateUser(data: {
    name: string;
    email: string;
  }): FormErrors<'name' | 'email'> {
    const errors: FormErrors<'name' | 'email'> = {};
    if (!isRequired(data.name)) errors.name = REQUIRED_MESSAGE;
    if (!isRequired(data.email)) errors.email = REQUIRED_MESSAGE;
    else if (!isValidEmail(data.email)) errors.email = EMAIL_MESSAGE;
    return errors;
  }

  export function hasErrors(errors: object): boolean {
    return Object.keys(errors).length > 0;
  }
}
