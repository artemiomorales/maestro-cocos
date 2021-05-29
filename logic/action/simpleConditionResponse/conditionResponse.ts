
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConditionResponse')
export class ConditionResponse {
  @property({visible: true})
  private _debug: boolean = false;
  public get debug() {
    return this._debug;
  }
  public set debug(value: boolean) {
    this._debug = value;
  }

  checkCondition(callingObject: Node) {
    if(this.debug) {
      console.log("Condition check triggered by " + callingObject.name);
    }
  }
}