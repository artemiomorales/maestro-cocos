
import { _decorator, Component, Node, EventHandler } from 'cc';
import { IntConditionResponse } from '../simpleConditionResponse/intConditionResponse';
const { ccclass, property } = _decorator;

@ccclass('IntConditionResponseAction')
export class IntConditionResponseAction extends IntConditionResponse {

  @property({type: [EventHandler], visible: true})
  private _action: EventHandler[] = [];
  public get action() {
    return this._action;
  }
  public set action(value: EventHandler[]) {
    this._action = value;
  }
  
  triggerResponse(callingObject: Node) {
    if(this.checkCondition(callingObject)) {
      EventHandler.emitEvents(this.action);
    }
  }
}