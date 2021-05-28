
import { _decorator, Component, Node, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VariableReferenceDictionary')
export class VariableReferenceDictionary {

  @property({type: TextAsset, visible: true})
  private _customKey: TextAsset = null!;

  public get customKey() {
    return this._customKey;
  }
  public set customKey(value: TextAsset) {
    this._customKey = value;
  }

}

