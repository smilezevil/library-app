import { button, el } from '../dom';

export function renderPagination(
  nav: HTMLElement,
  page: number,
  totalPages: number,
  onChange: (page: number) => void,
): void {
  nav.replaceChildren();
  nav.classList.toggle('d-none', totalPages <= 1);
  if (totalPages <= 1) return;

  const list = el('ul', 'pagination pagination-sm justify-content-center mb-0');

  const addItem = (label: string, target: number, disabled: boolean, active = false): void => {
    const item = el('li', `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`);
    const link = button('page-link', label, () => onChange(target));
    link.disabled = disabled;
    item.append(link);
    list.append(item);
  };

  addItem('«', page - 1, page === 1);
  for (let number = 1; number <= totalPages; number++) {
    addItem(String(number), number, false, number === page);
  }
  addItem('»', page + 1, page === totalPages);

  nav.append(list);
}
