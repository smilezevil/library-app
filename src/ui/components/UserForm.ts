import { NewUserData } from '../../services/LibraryManager';
import { Validation } from '../../utils/validators';
import { button, el } from '../dom';
import { FormField } from './FormField';

export class UserForm {
  readonly element: HTMLElement;
  private readonly name = new FormField("Ім'я");
  private readonly email = new FormField('Email');

  constructor(private readonly onSubmit: (data: NewUserData) => void) {
    this.element = el('div', 'card mb-3');
    const body = el('div', 'card-body');
    const form = el('form');
    form.noValidate = true;

    const submitButton = button('btn btn-success btn-sm', 'Додати Користувача');
    submitButton.type = 'submit';
    form.append(this.name.element, this.email.element, submitButton);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    body.append(el('h5', 'card-title mb-3', 'Додати Користувача'), form);
    this.element.append(body);
  }

  private handleSubmit(): void {
    const values = { name: this.name.value, email: this.email.value };
    const errors = Validation.validateUser(values);
    this.name.setError(errors.name);
    this.email.setError(errors.email);
    if (Validation.hasErrors(errors)) return;

    this.onSubmit(values);
    this.name.clear();
    this.email.clear();
  }
}
