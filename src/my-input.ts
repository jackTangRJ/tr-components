import { LitElement, css,html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-input')
export class MyInput extends LitElement {
  
  @property({type:String})
  name = ''
  render() {
    return html`
      <slot></slot>
      <auto-complete .name=${this.name}></auto-complete>
    `
  } 

  static styles = css`
  :host {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  ::slotted(h1) {
    font-size: 2em;
    line-height: 1.1;
  }
   
`

}

declare global {
  interface HTMLElementTagNameMap {
    'my-input': MyInput
  }
}
