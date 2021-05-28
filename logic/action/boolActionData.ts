
import { _decorator, Component, Node, Enum, TextAsset } from 'cc';
import { BoolReference } from '../../persistentData/boolReference';
import { GetSceneData } from '../../utils';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

var BoolActionType = Enum({
  SET_VALUE: -1,
  TOGGLE: -1,
})

@ccclass('BoolActionData')
export class BoolActionData extends ActionData {

  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;
  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  @property({type: BoolActionType, visible: true})
  private _boolActionType: number = null!;
  public get boolActionType() {
    return this._boolActionType;
  }
  public set boolActionType(value: number) {
    this._boolActionType = value;
  }

  @property({type: BoolReference, visible: true})
  private _targetValue: BoolReference = new BoolReference();
  public get targetValue() {
    return this._targetValue;
  }
  public set targetValue(value: BoolReference) {
    this._targetValue = value;
  }

  performAction (callingObject: Node) {
    const sceneData = GetSceneData();
    if(this.boolActionType === BoolActionType.SET_VALUE) {
      sceneData.setBoolValue(callingObject, this.variableKey, this.targetValue.getValue(callingObject))
    } else {
      const sourceBool = sceneData.getBoolValue(this.appSettingsNode, this.variableKey);
      sceneData.setBoolValue(callingObject, this.variableKey, !sourceBool)
    }
  }

}
