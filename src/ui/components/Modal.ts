import { Modal as BootstrapModal } from 'bootstrap';
import { NotificationType } from '../../types';
import { button, el } from '../dom';

export interface AlertOptions {
  message: string;
  buttonText?: string;
  type?: NotificationType;
}

export interface PromptOptions {
  title: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  validate?: (value: string) => string | null;
}

export class Modal {
  // Черга: наступне модальне вікно відкривається, тільки коли попереднє повністю закрилось
  private static chain: Promise<unknown> = Promise.resolve();

  static alert(options: AlertOptions): Promise<void> {
    return Modal.enqueue(() => Modal.showAlert(options));
  }

  static prompt(options: PromptOptions): Promise<string | null> {
    return Modal.enqueue(() => Modal.showPrompt(options));
  }

  private static enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = Modal.chain.then(task);
    Modal.chain = run.catch(() => undefined);
    return run;
  }

  private static createShell(title?: string) {
    const root = el('div', 'modal fade');
    root.tabIndex = -1;
    const dialog = el('div', 'modal-dialog modal-dialog-centered');
    const content = el('div', 'modal-content');
    const body = el('div', 'modal-body');
    const footer = el('div', 'modal-footer');

    if (title) {
      const header = el('div', 'modal-header');
      const close = el('button', 'btn-close');
      close.type = 'button';
      close.setAttribute('data-bs-dismiss', 'modal');
      close.setAttribute('aria-label', 'Закрити');
      header.append(el('h5', 'modal-title', title), close);
      content.append(header);
    }

    content.append(body, footer);
    dialog.append(content);
    root.append(dialog);
    document.body.append(root);

    return { root, body, footer, instance: new BootstrapModal(root) };
  }

  private static whenClosed(root: HTMLElement, instance: BootstrapModal): Promise<void> {
    return new Promise((resolve) => {
      root.addEventListener(
        'hidden.bs.modal',
        () => {
          instance.dispose();
          root.remove();
          resolve();
        },
        { once: true },
      );
    });
  }

  private static showAlert(options: AlertOptions): Promise<void> {
    const { root, body, footer, instance } = Modal.createShell();
    body.textContent = options.message;

    const variant = options.type === NotificationType.Error ? 'btn-danger' : 'btn-primary';
    const ok = button(`btn ${variant}`, options.buttonText ?? 'Зрозуміло!');
    ok.setAttribute('data-bs-dismiss', 'modal');
    footer.append(ok);

    const closed = Modal.whenClosed(root, instance);
    instance.show();
    return closed;
  }

  private static showPrompt(options: PromptOptions): Promise<string | null> {
    const { root, body, footer, instance } = Modal.createShell(options.title);

    const input = el('input', 'form-control form-control-lg');
    input.type = 'text';
    input.placeholder = options.placeholder ?? '';
    const error = el('div', 'text-danger small mt-2');
    body.append(input, error);

    const cancelButton = button('btn btn-secondary', options.cancelText ?? 'Скасувати');
    cancelButton.setAttribute('data-bs-dismiss', 'modal');

    let result: string | null = null;
    const submit = (): void => {
      const message = options.validate?.(input.value) ?? null;
      if (message) {
        error.textContent = message;
        input.classList.add('is-invalid');
        return;
      }
      result = input.value;
      instance.hide();
    };

    const confirmButton = button('btn btn-primary', options.confirmText ?? 'Зберегти', submit);
    footer.append(cancelButton, confirmButton);

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submit();
      }
    });
    root.addEventListener('shown.bs.modal', () => input.focus(), { once: true });

    const closed = Modal.whenClosed(root, instance);
    instance.show();
    return closed.then(() => result);
  }
}
