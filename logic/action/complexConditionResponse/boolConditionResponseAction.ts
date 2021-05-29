
import { _decorator, Component, Node, EventHandler } from 'cc';
import { BoolConditionResponse } from '../simpleConditionResponse/boolConditionResponse';
const { ccclass, property } = _decorator;

@ccclass('BoolConditionResponseAction')
export class BoolConditionResponseAction extends BoolConditionResponse {

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