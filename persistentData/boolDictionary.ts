
import { _decorator } from 'cc';
import VariableDictionary from './variableDictionary';
const { ccclass, property } = _decorator;

@ccclass('BoolDictionary')
export default class BoolDictionary extends VariableDictionary {

  @property({visible: true})
  private _value: Boolean = false;

  public get value() {
    return this._value;
  }
  public set value(value: Boolean) {
    this._value = value;
  }

}
