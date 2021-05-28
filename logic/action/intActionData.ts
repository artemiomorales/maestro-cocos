
import { _decorator, Component, Node, Enum, TextAsset } from 'cc';
import { BoolReference } from '../../persistentData/boolReference';
import { IntReference } from '../../persistentData/intReference';
import { GetSceneData } from '../../utils';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

var IntActionType = Enum({
  SetValue: -1,
  ApplyChange: -1,
  Multiply: -1,
  ClampMax: -1,
  ClampMin: -1,
  SetToDistance: -1,
  SetToRandom: -1,
  SetToDefaultValue: -1
})

@ccclass('IntActionData')
export class IntActionData extends ActionData {

  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;
  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  @property({type: IntActionType, visible: true})
  private _intActionType: number = null!;
  public get intActionType() {
    return this._intActionType;
  }
  public set intActionType(value: number) {
    this._intActionType = value;
  }

  @property({type: IntReference, visible: true})
  private _operatorValue: IntReference = new IntReference();
  public get operatorValue() {
    return this._operatorValue;
  }
  public set operatorValue(value: IntReference) {
    this._operatorValue = value;
  }

  performAction (callingObject: Node) {
    const sceneData = GetSceneData();
    const sourceInt = sceneData.getIntValue(callingObject, this.variableKey)
    const operatorValue = this.operatorValue.getValue(callingObject);

    if (this.canPerformAction() == false) {
      console.log("Required variable(s) not specified in {title}, canceling operation");
      return;
    }
    
    switch (this.intActionType) {
        
      case IntActionType.SetValue:
        sceneData.setIntValue(callingObject, this.variableKey, operatorValue);
        break;
      
      case IntActionType.ApplyChange:
        sceneData.setIntValue(callingObject, this.variableKey, sourceInt + operatorValue);
        break;
    
      case IntActionType.Multiply:
        sceneData.setIntValue(callingObject, this.variableKey, sourceInt * operatorValue);
        break;
      
      case IntActionType.ClampMax:
        sceneData.setIntValue(callingObject, this.variableKey, Math.max(sourceInt, operatorValue));
        break;
      
      case IntActionType.ClampMin:
        sceneData.setIntValue(callingObject, this.variableKey, Math.min(sourceInt, operatorValue));
        break;
      
      case IntActionType.SetToDistance:
        sceneData.setIntValue(callingObject, this.variableKey, Math.abs(sourceInt));
        break;
      
      case IntActionType.SetToRandom:
        sceneData.setIntValue(callingObject, this.variableKey, Math.round(Math.random()));
        break;

      case IntActionType.SetToDefaultValue:
        sceneData.setIntToDefault(callingObject, this.variableKey);
        break;
    }
  }

  canPerformAction () {
    if (!this.variableKey) {
        return false;
    }
    
    if (this.intActionType == IntActionType.SetToDefaultValue == false && 
        this.operatorValue.useReference == true && !this.operatorValue.variableReference) {
        return false;
    }

    return true;
  }

}
