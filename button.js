const trBtnTemplate = document.createElement("template");
trBtnTemplate.innerHTML = `
  <style>
    /* 
     * :host 用于设置组件宿主元素本身的样式。
     * 这对于控制组件的布局和默认显示方式至关重要。
     */
    :host {
      display: inline-block; /* 让组件像原生 button 一样是内联块元素 */
      outline: none; /* 移除浏览器默认的焦点轮廓，我们将自己实现 */
    }

    /* 
     * :host([disabled]) 响应外部添加的 disabled 属性。
     * 这是控制组件状态的关键。
     */
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.6;
    }

    .btn {
      display: flex; 
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-weight: 600;
      font-size: 16px;
      padding: 4px 15px;
      border-radius: 6px;
      text-decoration: none; 
      color: white;
      background-color: var(--color-primary); 
      box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    .btn:hover {
      background-color: var(--color-primary-hover);
    }

    .btn:active {
      background-color: var(--color-primary-active);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }


    .btn:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
    /* ::slotted 用于设置从外部传入的 slot 内容的样式 */
    ::slotted([slot="icon"]) {
      margin-right: 8px;
    }
  </style>

  <button class="btn" part="button">
    <slot name="icon"></slot>
    <slot>按钮</slot>
  </button>
`;

class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(trBtnTemplate.content.cloneNode(true));
  }
}

customElements.define("tr-button", Button);
