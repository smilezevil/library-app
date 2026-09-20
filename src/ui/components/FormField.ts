import { el } from '../dom';

export class FormField {
  readonly element: HTMLDivElement;
  private readonly input: HTMLInputElement;
  private readonly error: HTMLDivElement;

  constructor(placeholder: string, type = 'text') {
    this.element = el('div', 'mb-2');
    this.input = el('input', 'form-control form-control-sm');
    this.input.type = type;
    this.input.placeholder = placeholder;
    this.error = el('div', 'text-danger small');
    this.element.append(this.input, this.error);
  }

  get value(): string {
    return this.input.value;
  }

  setError(message?: string): void {
    this.error.textContent = message ?? '';
    this.input.classList.toggle('is-invalid', Boolean(message));
  }

  clear(): void {
    this.input.value = '';
    this.setError();
  }
}
