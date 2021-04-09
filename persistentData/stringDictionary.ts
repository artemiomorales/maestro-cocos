
import { TextAsset, _decorator } from 'cc';
import VariableDictionary from './variableDictionary';
const { ccclass, property } = _decorator;

@ccclass('StringDictionary')
export default class StringDictionary extends VariableDictionary {

  @property({type: TextAsset, visible: true})
  private _value: TextAsset = null!;

  public get value() {
    return this._value;
  }
  public set value(value: TextAsset) {
    this._value = value;
  }

}
