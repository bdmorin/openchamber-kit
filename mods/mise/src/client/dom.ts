type Child = Node | string | null | undefined | false;
type Props = {
  class?: string;
  title?: string;
  text?: string;
  html?: string;
  on?: Partial<Record<keyof HTMLElementEventMap, (event: Event) => void>>;
  attrs?: Record<string, string | null | undefined | false>;
  style?: Record<string, string>;
};

/** Small DOM builder. Strings become text nodes, so model text is never parsed as HTML. */
export const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Props | null = null, ...children: Child[]): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (props) {
    if (props.class) node.className = props.class;
    if (props.title) node.title = props.title;
    if (props.text !== undefined) node.textContent = props.text;
    // Only for our own static SVG icon strings.
    if (props.html !== undefined) node.innerHTML = props.html;
    for (const [name, value] of Object.entries(props.attrs ?? {})) {
      if (value !== null && value !== undefined && value !== false) node.setAttribute(name, value);
    }
    for (const [name, value] of Object.entries(props.style ?? {})) node.style.setProperty(name, value);
    for (const [name, handler] of Object.entries(props.on ?? {})) if (handler) node.addEventListener(name, handler);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  if (tag === 'button' && !(props?.attrs && 'type' in props.attrs)) (node as HTMLButtonElement).type = 'button';
  return node;
};

/** Reports the document height to the host whenever it changes (Work Status sizing). */
export const trackHeight = (root: HTMLElement, report: (height: number) => void): void => {
  let last = -1;
  new ResizeObserver(() => {
    const height = Math.ceil(root.getBoundingClientRect().height);
    if (height === last) return;
    last = height;
    report(height);
  }).observe(root);
};
