
import { CCString, TextAsset, _decorator, Node } from 'cc';
import { VariableReference } from './variableReference';
const { ccclass, property } = _decorator;

@ccclass('StringReference')
export class StringReference extends VariableReference {

  @property({type: CCString, visible: true})
  private _value: string = "";

  public get value() {
    return this._value;
  }
  public set value(value: string) {
    this._value = value;
  }

  getValue(callingObject: Node) {
    if(this.useReference) {
      console.log(this.variableReference.name);
      return this.variableReference.name;
    }

    return this.value;
  }

}
