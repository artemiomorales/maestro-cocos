
import { _decorator, Component, Node, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiOpacityExtensions')
export class UiOpacityExtensions extends Component {

  @property({type: UIOpacity, visible: false})
  private _uiOpacityComponent: UIOpacity = null!;
  public get uiOpacityComponent() {
    return this._uiOpacityComponent;
  }
  public set uiOpacityComponent(value: UIOpacity) {
    this._uiOpacityComponent = value;
  }

  start () {
    this.uiOpacityComponent = this.node.getComponent(UIOpacity) as UIOpacity;
  }

  setOpaque() {
    this.uiOpacityComponent.opacity = 255;
  }

  setTransparent() {
    this.uiOpacityComponent.opacity = 0;
  }

}