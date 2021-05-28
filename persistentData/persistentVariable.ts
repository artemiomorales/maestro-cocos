
import { _decorator, Component, Node, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PersistentVariable')
export class PersistentVariable {

  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;
  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  @property({visible: true})
  private _hasDefault: Boolean = false;
  protected get hasDefault() {
    return this._hasDefault;
  }
  protected set hasDefault(value: Boolean) {
    this._hasDefault = value;
  }

}
