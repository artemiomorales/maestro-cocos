
import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputModule')
export default class InputModule extends Component {

  @property({type: CCInteger, visible: true})
  private _priority: number = 0;
  public get priority() {
    return this._priority;
  }
  public set priority(value: number) {
    this._priority = value;
  }

}