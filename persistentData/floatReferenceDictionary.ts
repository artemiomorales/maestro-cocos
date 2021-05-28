
import { _decorator, Component, Node } from 'cc';
import { FloatReference } from './floatReference';
import { VariableReferenceDictionary } from './variableReferenceDictionary';
const { ccclass, property } = _decorator;

@ccclass('FloatReferenceDictionary')
export class FloatReferenceDictionary extends VariableReferenceDictionary {

  @property({type: FloatReference, visible: true})
  private _floatReference: FloatReference = null!;

  public get floatReference() {
    return this._floatReference;
  }
  public set floatReference(value: FloatReference) {
    this._floatReference = value;
  }

}
