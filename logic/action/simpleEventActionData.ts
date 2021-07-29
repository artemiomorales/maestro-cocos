
import { _decorator, Node, TextAsset } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

@ccclass('SimpleEventActionData')
export default class SimpleEventActionData extends ActionData {

  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;
  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  @property({type: SIMPLE_EVENT, visible: true})
  private _simpleEvent: number = null!;

  public get simpleEvent() {
    return this._simpleEvent;
  }
  public set simpleEvent(value: number) {
    this._simpleEvent = value;
  }

  performAction (callingObject: Node) {
    if(this.variableKey !== null) {
      this.appSettings.triggerSimpleEvent(callingObject, this.variableKey.name);
    }
    if(this.simpleEvent !== null) {
      this.appSettings.triggerSimpleEvent(callingObject, Object.keys(SIMPLE_EVENT)[this.simpleEvent]);
    }
  }

}