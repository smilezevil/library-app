import { LibraryManager } from '../services/LibraryManager';
import { paginate } from '../utils/pagination';
import { Validation } from '../utils/validators';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Modal } from './components/Modal';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { el } from './dom';

const PAGE_SIZE = 5;

export function mountApp(root: HTMLElement, manager: LibraryManager): void {
  const state = { query: '', bookPage: 1, userPage: 1 };

  const bookForm = new BookForm((data) => {
    manager.addBook(data);
    refresh();
  });

  const userForm = new UserForm((data) => {
    manager.addUser(data);
    refresh();
  });

  const bookList = new BookList({
    onBorrow: (bookId) => {
      void borrow(bookId);
    },
    onReturn: (bookId) => {
      manager.returnBook(bookId);
      refresh();
    },
    onDelete: (bookId) => {
      manager.removeBook(bookId);
      refresh();
    },
    onSearch: (query) => {
      state.query = query;
      state.bookPage = 1;
      refresh();
    },
    onPageChange: (page) => {
      state.bookPage = page;
      refresh();
    },
  });

  const userList = new UserList({
    onDelete: (userId) => {
      manager.removeUser(userId);
      refresh();
    },
    onPageChange: (page) => {
      state.userPage = page;
      refresh();
    },
  });

  async function borrow(bookId: string): Promise<void> {
    const userId = await Modal.prompt({
      title: 'Введіть ID користувача для позичення книги:',
      placeholder: 'ID',
      confirmText: 'Зберегти',
      cancelText: 'Скасувати',
      validate: Validation.validateUserId,
    });
    if (userId === null) return;

    manager.borrowBook(bookId, userId.trim());
    refresh();
  }

  function refresh(): void {
    const books = paginate(manager.searchBooks(state.query), state.bookPage, PAGE_SIZE);
    state.bookPage = books.page;
    bookList.update(books);

    const users = paginate(manager.getUsers(), state.userPage, PAGE_SIZE);
    state.userPage = users.page;
    userList.update(users);
  }

  const container = el('div', 'container app-container py-4');
  container.append(
    el('h1', 'text-center mb-4', 'Система Управління Бібліотекою'),
    bookForm.element,
    userForm.element,
    bookList.element,
    userList.element,
  );
  root.replaceChildren(container);

  refresh();
}
