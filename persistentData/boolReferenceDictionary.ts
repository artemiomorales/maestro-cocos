
import { _decorator, Component, Node } from 'cc';
import { BoolReference } from './boolReference';
import { VariableReferenceDictionary } from './variableReferenceDictionary';
const { ccclass, property } = _decorator;

@ccclass('BoolReferenceDictionary')
export class BoolReferenceDictionary extends VariableReferenceDictionary {

  @property({type: BoolReference, visible: true})
  private _boolReference: BoolReference = null!;

  public get boolReference() {
    return this._boolReference;
  }
  public set boolReference(value: BoolReference) {
    this._boolReference = value;
  }

  getValue (callingObject: Node) {
    return this.boolReference.getValue(callingObject);
  }

}
