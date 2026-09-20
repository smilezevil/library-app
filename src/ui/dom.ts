export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function button(className: string, text: string, onClick?: () => void): HTMLButtonElement {
  const btn = el('button', className, text);
  btn.type = 'button';
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}
