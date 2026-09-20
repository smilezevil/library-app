import { User } from '../../models/User';
import { Page } from '../../utils/pagination';
import { button, el } from '../dom';
import { renderPagination } from './Pagination';

export interface UserListHandlers {
  onDelete: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export class UserList {
  readonly element: HTMLElement;
  private readonly list: HTMLUListElement;
  private readonly pagination: HTMLElement;

  constructor(private readonly handlers: UserListHandlers) {
    this.element = el('div', 'card mb-3');
    const body = el('div', 'card-body');

    this.list = el('ul', 'list-group list-group-flush');
    this.pagination = el('nav', 'mt-3');

    body.append(el('h5', 'card-title mb-3', 'Список Користувачів'), this.list, this.pagination);
    this.element.append(body);
  }

  update(view: Page<User>): void {
    this.list.replaceChildren();

    if (view.items.length === 0) {
      this.list.append(el('li', 'list-group-item text-muted', 'Користувачів ще немає'));
    }
    for (const user of view.items) {
      const item = el(
        'li',
        'list-group-item d-flex justify-content-between align-items-center gap-2 px-0',
      );
      const remove = button('btn btn-outline-danger btn-sm', 'Видалити', () =>
        this.handlers.onDelete(user.id),
      );
      item.append(el('span', '', user.toString()), remove);
      this.list.append(item);
    }

    renderPagination(this.pagination, view.page, view.totalPages, this.handlers.onPageChange);
  }
}
