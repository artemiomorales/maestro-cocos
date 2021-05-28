
import { _decorator, Component, Node } from 'cc';
import { StringReference } from './stringReference';
import { VariableReferenceDictionary } from './variableReferenceDictionary';
const { ccclass, property } = _decorator;

@ccclass('StringReferenceDictionary')
export class StringReferenceDictionary extends VariableReferenceDictionary {

  @property({type: StringReference, visible: true})
  private _stringReference: StringReference = null!;

  public get stringReference() {
    return this._stringReference;
  }
  public set stringReference(value: StringReference) {
    this._stringReference = value;
  }

  getValue (callingObject: Node) {
    return this.stringReference.getValue(callingObject);
  }


}