
import { _decorator, Component, Node, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AppSettingsVariableReference')
export class AppSettingsVariableReference {
    
  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;

  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  private _getMethod: Function = null!;

  public get getMethod() {
    return this._getMethod;
  }
  public set getMethod(value: Function) {
    this._getMethod = value;
  }

  private _setMethod: Function = null!;

  public get setMethod() {
    return this._setMethod;
  }
  public set setMethod(value: Function) {
    this._setMethod = value;
  }
  
}