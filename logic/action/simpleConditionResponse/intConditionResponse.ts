
import { _decorator, Component, Node } from 'cc';
import { IntReference } from '../../../persistentData/intReference';
import { COMPARISON_VALUES } from '../../../constants';
const { ccclass, property } = _decorator;

@ccclass('IntConditionResponse')
export class IntConditionResponse {

  @property({type: IntReference, visible: true})
  private _intReference: IntReference = new IntReference();
  public get intReference() {
    return this._intReference;
  }
  public set intReference(value: IntReference) {
    this._intReference = value;
  }

  @property({type: COMPARISON_VALUES, visible: true})
  private _operation: number = null!;
  public get operation() {
    return this._operation;
  }
  public set operation(value: number) {
    this._operation = value;
  }

  @property({type: IntReference, visible: true})
  private _intConditionVar: IntReference = new IntReference();
  public get intConditionVar() {
    return this._intConditionVar;
  }
  public set intConditionVar(value: IntReference) {
    this._intConditionVar = value;
  }

  checkCondition(callingObject: Node) {
    switch (this.operation) {

      case COMPARISON_VALUES.EQUAL_TO:
          if (this.intReference.getValue(callingObject) == this.intConditionVar.getValue(callingObject)) {
              return true;
          }
          break;
          
      case COMPARISON_VALUES.NOT_EQUAL_TO:
          if (this.intReference.getValue(callingObject) != this.intConditionVar.getValue(callingObject)) {
              return true;
          }
          break;

      case COMPARISON_VALUES.GREATER_THAN:
          if (this.intReference.getValue(callingObject) > this.intConditionVar.getValue(callingObject)) {
              return true;
          }
          break;

      case COMPARISON_VALUES.LESS_THAN:

          if (this.intReference.getValue(callingObject) < this.intConditionVar.getValue(callingObject)) {
              return true;
          }
          break;
    }
    return false; 
  }

}
