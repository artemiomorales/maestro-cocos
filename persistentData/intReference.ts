
import { _decorator, CCInteger, Node } from 'cc';
import { GetSceneData } from '../utils';
import { VariableReference } from './variableReference';
const { ccclass, property } = _decorator;

@ccclass('IntReference')
export class IntReference extends VariableReference{

  @property({type: CCInteger, visible: true})
  private _value: number = 0;

  public get value() {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
  }

  getValue(callingObject: Node) {
    if(this.useReference) {
      const sceneData = GetSceneData();
      return sceneData.getIntValue(callingObject, this.variableReference);
    }

    return this.value;
  }

}