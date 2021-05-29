
import { _decorator, Component, Node, Enum } from 'cc';
import ActionData from './actionData';
import { BoolConditionResponseAction } from './complexConditionResponse/boolConditionResponseAction';
import { IntConditionResponseAction } from './complexConditionResponse/intConditionResponseAction';
const { ccclass, property } = _decorator;

var EventExecutionType = Enum({
  EXECUTE_ALL: -1,
  CANCEL_AFTER_FIRST_SUCCESS: -1
})

@ccclass('ComplexConditionResponseActionData')
export class ComplexConditionResponseActionData extends ActionData {

  @property({type: EventExecutionType, visible: true})
  private _eventExecutionType: number = null!;
  public get eventExecutionType() {
    return this._eventExecutionType;
  }
  public set eventExecutionType(value: number) {
    this._eventExecutionType = value;
  }

  @property({type: [IntConditionResponseAction], visible: true})
  private _intEvents: IntConditionResponseAction[] = [];
  public get intEvents() {
    return this._intEvents;
  }
  public set intEvents(value: IntConditionResponseAction[]) {
    this._intEvents = value;
  }

  @property({type: [BoolConditionResponseAction], visible: true})
  private _boolEvents: BoolConditionResponseAction[] = [];
  public get boolEvents() {
    return this._boolEvents;
  }
  public set boolEvents(value: BoolConditionResponseAction[]) {
    this._boolEvents = value;
  }

  initialize () {
    // if(this.intEvents.length === 0) {
    //   this.intEvents = null!;
    // }
    // if(this.boolEvents.length === 0) {
    //   this.intEvents = null!;
    // }
  }

  performAction (callingObject: Node) {

    if (this.eventExecutionType == EventExecutionType.EXECUTE_ALL) {
      this.triggerAllResponses(callingObject);
    }
    else if(this.eventExecutionType == EventExecutionType.CANCEL_AFTER_FIRST_SUCCESS) {
      this.triggerUntilFirstSuccess(callingObject);
    }

  }

  triggerAllResponses(callingObject: Node) {
    for (let i = 0; i < this.intEvents.length; i++) {
      this.intEvents[i].triggerResponse(callingObject);    
    }
    for (let i = 0; i < this.boolEvents.length; i++) {
      this.boolEvents[i].triggerResponse(callingObject);    
    }
  }

  triggerUntilFirstSuccess(callingObject: Node) {
    for (let i = 0; i < this.intEvents.length; i++) {
      if (this.intEvents[i].checkCondition(callingObject) === true) {
        this.intEvents[i].triggerResponse(callingObject);
        return;
      }
    }
    for (let i = 0; i < this.boolEvents.length; i++) {
      if (this.boolEvents[i].checkCondition(callingObject) === true) {
        this.boolEvents[i].triggerResponse(callingObject);
        return;
      }
    }
  }

}
