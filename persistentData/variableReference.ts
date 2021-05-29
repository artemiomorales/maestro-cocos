
import { _decorator, TextAsset, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VariableReference')
export class VariableReference {

  @property({visible: true})
  private _useReference: Boolean = false;
  public get useReference() {
    return this._useReference;
  }
  public set useReference(value: Boolean) {
    this._useReference = value;
  }
    
  @property({type: TextAsset, visible: true})
  private _variableReference: TextAsset = null!;
  public get variableReference() {
    return this._variableReference;
  }
  public set variableReference(value: TextAsset) {
    this._variableReference = value;
  }

}
