const trSwitchTemplate = document.createElement("template");
trSwitchTemplate.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
    }
    :host{
      --switch-width: 60px;
      --switch-height: 28px;
      --switch-radius: 14px;
      --switch-dot-size: 20px;
      --switch-text-indent: 8px;
      --switch-dot-pos-left: 3px;
      --switch-dot-pos-top: 3px;
      --switch-dot-pos-left-checked: 35px;
    }
    :host([size="large"]){
      --switch-width: 64px;
      --switch-height: 32px;
      --switch-radius: 16px;
      --switch-dot-size: 26px;
      --switch-text-indent: 12px;
    }
    :host([disabled="true"]) , :host([disabled=""]) {
      opacity: 0.5;
      cursor: not-allowed;
    }
    :host([disabled="true"]) .switch-input , :host([disabled=""]) .switch-input {
      cursor: not-allowed;
    }
    .switch-input {
      appearance: none;
      width: var(--switch-width);
      height: var(--switch-height);
      position: relative;
      border-radius: var(--switch-radius);
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.25);
      transition: all 0.2s;
    }
    .switch-input:before {
      content: "";
      position: absolute;
      width: var(--switch-dot-size);
      height: var(--switch-dot-size);
      background: white;
      left: var(--switch-dot-pos-left);
      top: var(--switch-dot-pos-top);
      border-radius: 50%;
      transition: left cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
    }
    .switch-input:after {
      content: "开 关";
      text-indent: var(--switch-text-indent);
      word-spacing: 7px;
      display: inline-block;
      white-space: nowrap;
      color: white;
      font: 14px monospace;
      line-height: var(--switch-height);
      font-weight: 800;
    }
    .switch-input:hover {
      background-color: rgba(0, 0, 0, 0.45);
    }
    .switch-input:checked {
      background-color: var(--color-primary);
    }
    .switch-input:checked:before {
      left: var(--switch-dot-pos-left-checked);
    }
    .switch-icon {
      margin-left: 8px;
    }
  </style>
  <div>
    <input type="checkbox" class="switch-input" />
    <slot name="icon" class="switch-icon"></slot>
  </div>
`;

class Switch extends HTMLElement {
  static get observedAttributes() {
    return ["checked", "disabled", "size"];
  }

  // 1. 声明自己是表单关联元素
  static formAssociated = true;

  constructor() {
    super();
    // 2. 在 constructor 的最开始，当 this 还是空的时候，调用 attachInternals
    this.internals_ = this.attachInternals();
    this.checked = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(trSwitchTemplate.content.cloneNode(true));
    // 监听switch事件
    this.core.addEventListener("change", this._handleChange.bind(this));

    // 监听来自父级的上下文变化事件
    document.addEventListener(
      "form-context-change",
      this._handleContextChange.bind(this)
    );
  }

  get core() {
    return this.shadowRoot.querySelector(".switch-input");
  }

  get onchange() {
    return this._onchange || null;
  }

  /**
   * Setter: 当别人设置 element.onchange = fn 或 <tr-switch onchange="..."> 时，
   * 浏览器会将处理函数作为 `newValue` 传进来。
   */

  set onchange(newValue) {
    if (this._onchange) {
      // 如果之前已经有 onchange 处理函数，先移除旧的监听器
      this.core.removeEventListener("change", this._onchange);
    }
    if (typeof newValue === "function") {
      this._onchange = newValue;
      this.core.addEventListener("change", this._onchange);
    } else {
      this._onchange = null;
    }
  }

  _handleChange() {
    if (this.hasAttribute("disabled")) {
      return;
    }
    const switchChecked = this.core.checked;
    this.checked = switchChecked;
    this.setAttribute("checked", this.checked);
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          checked: this.checked,
        },
      })
    );
  }

  _handleContextChange(e) {
    // 检查事件是否发生在自己的一个祖先元素上
    if (e.target.contains(this)) {
      const { disabled } = e.detail;
      this.setDisabled(String(disabled));
    }
  }

  setDisabled(newValue = "") {
    const shouldDisabled = newValue === "true" || newValue === "";
    if (shouldDisabled === this.disabled) return;
    this.disabled = shouldDisabled;
    this.core.disabled = this.disabled;
    this.setAttribute("disabled", this.disabled);
  }

  connectedCallback() {
    // 初始检查：如果一上来就在一个 disabled form 里，CSS 变量会立即生效
    const parentForm = this.closest("tr-form");
    if (parentForm && parentForm.hasAttribute("disabled")) {
      this.setDisabled();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      // 如果是disabled状态，不更新checked
      if (this.disabled) {
        return;
      }
      this.checked = newValue === "true" || newValue === "";
      this.core.checked = this.checked;
    }
    if (name === "disabled") {
      this.setDisabled(newValue);
    }
  }
  disconnectedCallback() {
    this.core.removeEventListener("change", this._onchange);
  }
}

customElements.define("tr-switch", Switch);
