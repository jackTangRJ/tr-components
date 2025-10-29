import { LitElement, css, html } from 'lit'
import { customElement, property ,state  , query  } from 'lit/decorators.js'
interface optionItem {
  id: string
  name: string
  age: number
  sex: string
  weight: string
  avatar: string
}
 
@customElement('auto-complete')
export class AutoComplete extends LitElement {
  /**
   * 展开状态
   */
  @property({type:Boolean})
  visible = false

  @property({type:String})
  value = ''

  @property({type:String})
  name = ''
  
  
  @property({type:String , useDefault: true})
  valueField = 'id' as keyof optionItem  

  @property({type:Array})
  data = []

  @property({type:Object})
  params = {} as object

  @property({type:[String , Function]})
  api: string | Function=''


  /**
   * 查询的关键字字段
   */
  @property({type:String})
  keyword = 'name' as keyof optionItem

  @state()
  dataSource = this.data as optionItem[]

  @query('.complete-input')
  private $input!: HTMLInputElement

  private timer: number | undefined
  
  render() {
    return html`
    <input placeholder="请输入"  type="text" name=${this.name} .value=${this.value} @input=${this._onInput}  class="complete-input"/>
    <img src="https://api.iconify.design/lucide/x-circle.svg?color=%23888888" width="16" @click=${this._clearValue} class="clear-icon" ?show=${!!this.value}>
    <div class="complete-popup" ?show=${this.visible && this.dataSource.length} @click=${this._select}>
        <ul>
          ${
           this.dataSource.map(item => {
              return html`
                <li value=${item[this.valueField]}>
                  <img src=${item.avatar} width="20"/>
                  <span>${item[this.keyword]}</span>
                  <span>${item.sex}</span>
                  <span>${item.age}</span>
                  <span>${item.weight}</span>
                </li>
              `
            })
          }
        </ul>
    </div>
    `
  }

  firstUpdated() {
    setTimeout(() => {
      this.dataSource = this.data as optionItem[]
    }, 0)
    document.addEventListener('click', this.listerClick.bind(this))
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.listerClick.bind(this))
  }

  private _clearValue() {
    this.value = ''
    this.visible = false
    if(this.$input){
      this.$input.focus()
    }
  }

  private listerClick(e: Event) {
    if(!this.visible) return 
    if(e.target !== this){
      this.visible = false
    }
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value
    this.visible = true
    if(this.api){
      this._fetchRemoteData()
    }else{
      this._handleFilter()
    }
  }

  jsonParams2UrlParams(params: any){
    return Object.keys(params).map((key:string) => `${key}=${params[key]}`).join('&')
  }

  private _fetchRemoteData(){
    if(this.timer){
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      if(typeof this.api === 'string'){
        const _params = {
          ...this.params,
          [this.keyword+'_like']: this.value
        }
      window.fetch(`${this.api}?${this.jsonParams2UrlParams(_params)}`, {
        method: 'GET',
      }).then(res => {
        return res.json()
      }).then(data => {
        this.dataSource = data as optionItem[]
      })
    }
    }, 500)
  }

  private _handleFilter(){
    if(!this.value){
      this.dataSource = this.data
      return
    }
    // 根据关键字进行过滤
    this.dataSource = this.data.filter(item => {
      if(item[this.keyword] && typeof item[this.keyword] === 'string'){
        return (item[this.keyword] as string).includes(this.value)
      }
      return false
    })
  }

 

  private _select(e: Event) {
    const mainValue = (e.target as HTMLInputElement).getAttribute('value')||''
    const getItem = this.dataSource.find(item => item[this.valueField] === mainValue)
    this.value = getItem![this.keyword] as string
    this.visible = false
    const selectEvent = new CustomEvent('select', {
      composed: true,
      bubbles: true,
      detail: {
        value: this.value,
        item: getItem
      }
    })
    this.dispatchEvent(selectEvent)
  }

  static styles = css`
    :host {
      all: initial;
      display: inline-flex;
      width: 400px;
      position: relative;
      margin:10px auto;
    }
    .complete-input{
      all: initial;
      width: 100%;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-medium);
      padding: 4px 8px;
    }
    .complete-popup{
      position: absolute;
      top: 120%;
      left: 0;
      right: 0;
      max-height: 0;
      width:100%;
      z-index: 100;
      opacity: 0;
      overflow-y: auto;
      overflow-x: hidden;
      /* 美化滚动条 */
      scrollbar-width: thin;
      scrollbar-color: var(--color-border) transparent;
      transition: all 0.3s ease;
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.88);
      border-radius:8px;
    }
    .complete-popup[show]{
      max-height: 250px;
      opacity: 1;
    }
    .complete-popup ul{
      list-style: none;
      margin: 0;
      padding: 4px;
    }    
    .complete-popup li{
      border-radius: 4px;
      transition: background 0.3s ease;
      padding: 3px 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      img{
        border-radius:50%;
      }
    }
    .complete-popup li:hover{
      background-color: rgba(0, 0, 0, 0.04);
    }
    .clear-icon{
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: none;
      cursor: pointer;
    }
    .clear-icon[show]{
      display: block;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'auto-complete': AutoComplete
  }
}
