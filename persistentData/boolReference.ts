
import { Node, _decorator } from 'cc';
import { GetSceneData } from '../utils';
import { VariableReference } from './variableReference';
const { ccclass, property } = _decorator;

@ccclass('BoolReference')
export class BoolReference extends VariableReference {

  @property({visible: true})
  private _value: boolean = false;

  private get value() {
    return this._value;
  }
  private set value(value: boolean) {
    this._value = value;
  }

  getValue(callingObject: Node) {
    if(this.useReference) {
      const sceneData = GetSceneData();
      return sceneData.getBoolValue(callingObject, this.variableReference);
    }
    return this.value;
  }

  // setValue(callingObject: Node, targetValue: boolean) {
  //   if(this.useReference) {
  //     const sceneData = GetSceneData();
  //     return sceneData.setBoolValue(callingObject, this.variableReference, targetValue);
  //   }
  // }

}
