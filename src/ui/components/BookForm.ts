import { NewBookData } from '../../services/LibraryManager';
import { Validation } from '../../utils/validators';
import { button, el } from '../dom';
import { FormField } from './FormField';

export class BookForm {
  readonly element: HTMLElement;
  private readonly title = new FormField('Назва книги');
  private readonly author = new FormField('Автор');
  private readonly year = new FormField('Рік видання');

  constructor(private readonly onSubmit: (data: NewBookData) => void) {
    this.element = el('div', 'card mb-3');
    const body = el('div', 'card-body');
    const form = el('form');
    form.noValidate = true;

    const submitButton = button('btn btn-success btn-sm', 'Додати Книгу');
    submitButton.type = 'submit';
    form.append(this.title.element, this.author.element, this.year.element, submitButton);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    body.append(el('h5', 'card-title mb-3', 'Додати Книгу'), form);
    this.element.append(body);
  }

  private handleSubmit(): void {
    const values = {
      title: this.title.value,
      author: this.author.value,
      year: this.year.value,
    };
    const errors = Validation.validateBook(values);
    this.title.setError(errors.title);
    this.author.setError(errors.author);
    this.year.setError(errors.year);
    if (Validation.hasErrors(errors)) return;

    this.onSubmit({
      title: values.title,
      author: values.author,
      year: Number(values.year),
    });
    this.title.clear();
    this.author.clear();
    this.year.clear();
  }
}
