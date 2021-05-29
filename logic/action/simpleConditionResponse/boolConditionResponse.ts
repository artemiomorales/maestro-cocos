
import { _decorator, Node } from 'cc';
import { BoolReference } from '../../../persistentData/boolReference';
import { ConditionResponse } from './conditionResponse';
const { ccclass, property } = _decorator;

@ccclass('BoolConditionResponse')
export class BoolConditionResponse extends ConditionResponse {

  @property({type: BoolReference, visible: true})
  private _boolReference: BoolReference = new BoolReference();
  public get boolReference() {
    return this._boolReference;
  }
  public set boolReference(value: BoolReference) {
    this._boolReference = value;
  }

  @property({type: BoolReference, visible: true})
  private _boolConditionVar: BoolReference = new BoolReference();
  public get boolConditionVar() {
    return this._boolConditionVar;
  }
  public set boolConditionVar(value: BoolReference) {
    this._boolConditionVar = value;
  }

  checkCondition(callingObject: Node) {
    super.checkCondition(callingObject);
    if(this.debug) {
      console.log("Reference value: " + this.boolReference.getValue(callingObject));
      console.log("Condition value: " + this.boolConditionVar.getValue(callingObject));
    }
    if (this.boolReference.getValue(callingObject) === this.boolConditionVar.getValue(callingObject)) {
      return true;
    }
    return false; 
  }

}
