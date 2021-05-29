
import { _decorator, Component, Node, Enum, EventHandler } from 'cc';
import ActionData from './actionData';
import { BoolConditionResponse } from './simpleConditionResponse/boolConditionResponse';
import { IntConditionResponse } from './simpleConditionResponse/intConditionResponse';
const { ccclass, property } = _decorator;

@ccclass('SimpleConditionResponseActionData')
export class SimpleConditionResponseActionData extends ActionData {

  @property({type: [IntConditionResponse], visible: true})
  private _intConditions: IntConditionResponse[] = [];
  public get intConditions() {
    return this._intConditions;
  }
  public set intConditions(value: IntConditionResponse[]) {
    this._intConditions = value;
  }

  @property({type: [BoolConditionResponse], visible: true})
  private _boolConditions: BoolConditionResponse[] = [];
  public get boolConditions() {
    return this._boolConditions;
  }
  public set boolConditions(value: BoolConditionResponse[]) {
    this._boolConditions = value;
  }

  @property({type: [EventHandler], visible: true})
  private _action: EventHandler[] = [];
  public get action() {
    return this._action;
  }
  public set action(value: EventHandler[]) {
    this._action = value;
  }

  initialize () {
    if(this.intConditions.length === 0) {
      this.intConditions = null!;
    }
    if(this.boolConditions.length === 0) {
      this.boolConditions = null!;
    }
  }

  performAction (callingObject: Node) {
    for (let i = 0; i < this.intConditions.length; i++) {
      if (this.intConditions[i].checkCondition(callingObject) == false) {
          return false;
      }
    }
    for (let i = 0; i < this.boolConditions.length; i++) {
      if (this.boolConditions[i].checkCondition(callingObject) == false) {
          return false;
      }
    }
    EventHandler.emitEvents(this.action);
  }

}
