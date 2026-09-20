import { Book } from '../../models/Book';
import { Page } from '../../utils/pagination';
import { button, el } from '../dom';
import { renderPagination } from './Pagination';

export interface BookListHandlers {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
}

export class BookList {
  readonly element: HTMLElement;
  private readonly list: HTMLUListElement;
  private readonly pagination: HTMLElement;

  constructor(private readonly handlers: BookListHandlers) {
    this.element = el('div', 'card mb-3');
    const body = el('div', 'card-body');

    const search = el('input', 'form-control form-control-sm mb-3');
    search.type = 'search';
    search.placeholder = 'Пошук за автором або назвою';
    search.addEventListener('input', () => this.handlers.onSearch(search.value));

    this.list = el('ul', 'list-group list-group-flush');
    this.pagination = el('nav', 'mt-3');

    body.append(el('h5', 'card-title mb-3', 'Список Книг'), search, this.list, this.pagination);
    this.element.append(body);
  }

  update(view: Page<Book>): void {
    this.list.replaceChildren();

    if (view.items.length === 0) {
      this.list.append(el('li', 'list-group-item text-muted', 'Книг не знайдено'));
    }
    for (const book of view.items) {
      this.list.append(this.createItem(book));
    }

    renderPagination(this.pagination, view.page, view.totalPages, this.handlers.onPageChange);
  }

  private createItem(book: Book): HTMLLIElement {
    const item = el(
      'li',
      'list-group-item d-flex justify-content-between align-items-center gap-2 px-0',
    );
    const actions = el('div', 'd-flex gap-2 flex-shrink-0');

    if (book.isBorrowed) {
      actions.append(
        button('btn btn-warning btn-sm', 'Повернути', () => this.handlers.onReturn(book.id)),
      );
    } else {
      actions.append(
        button('btn btn-primary btn-sm', 'Позичити', () => this.handlers.onBorrow(book.id)),
      );
    }
    actions.append(
      button('btn btn-outline-danger btn-sm', 'Видалити', () => this.handlers.onDelete(book.id)),
    );

    item.append(el('span', '', book.toString()), actions);
    return item;
  }
}
