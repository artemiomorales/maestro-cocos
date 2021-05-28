
import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonExtensions')
export class ButtonExtensions extends Component {

  @property({type: Button, visible: false})
  private _buttonComponent: Button = null!;
  public get buttonComponent() {
    return this._buttonComponent;
  }
  public set buttonComponent(value: Button) {
    this._buttonComponent = value;
  }

  start () {
    this.initialize();
  }

  initialize() {
    this.buttonComponent = this.node.getComponent(Button) as Button;
  }

  activate() {
    if(!this.buttonComponent) {
      this.initialize();
    }
    this.buttonComponent.interactable = true;
  }

  deactivate() {
    if(!this.buttonComponent) {
      this.initialize();
    }
    this.buttonComponent.interactable = false;
  }

}