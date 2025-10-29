class Form extends HTMLElement {
  static get observedAttributes() {
    return ["disabled"];
  }

  // 还需要一个 style 标签来定义 CSS 变量
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host([disabled]) {
          --form-is-disabled: 1;
        }
      </style>
      <form>
        <slot></slot>
      </form>
      `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      this.dispatchEvent(
        new CustomEvent("form-context-change", {
          bubbles: true, // 允许事件冒泡
          composed: true, // 允许穿透 Shadow DOM
          detail: { disabled: this.hasAttribute("disabled") },
        })
      );
    }
  }
}
customElements.define("tr-form", Form);
