import { LitElement, css, html } from 'lit'
import { customElement, property , query } from 'lit/decorators.js'

/**
 * tr-switch
 *
 * @slot - This element has a slot
 * @csspart switch-wrap - The switch wrap
 * @csspart switch-input - The switch input
 * @csspart switch-icon - The switch icon
 */
@customElement('tr-switch')
export class TrSwitch extends LitElement {
  /**
   * switch状态
   */
  @property({type:Boolean})
  checked = true

  @property({type:String , reflect: true})
  size = 'small'

  @property({type:Boolean , reflect: true})
  disabled = false

  @query('.switch-input')
  private $input!: HTMLInputElement

  render() {
    return html`
     <div part="switch-wrap">
        <input type="checkbox" class="switch-input" part="switch-input" .checked=${this.checked} ?disabled=${this.disabled} @change=${this._onChange}/>
        <slot name="icon" class="switch-icon" part="switch-icon" @click=${this._onClickSlot}>
           ${this.size}
        </slot>
      </div>
    `
  }

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked
    // 创建自定义事件,外部可使用@change监听
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked} , composed: true , bubbles: true }))
  }

  private _onClickSlot() {
    console.log('当前的Input的状态' , this.$input.checked)
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      transition: all 0.2s;
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
    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }
    :host([disabled]) .switch-input {
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'tr-switch': TrSwitch
  }
}
