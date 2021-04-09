
import { _decorator, CCFloat } from 'cc';
import VariableDictionary from './variableDictionary';
const { ccclass, property } = _decorator;

@ccclass('FloatDictionary')
export default class FloatDictionary extends VariableDictionary{

  @property({type: CCFloat, visible: true})
  private _value: number = 0;

  public get value() {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
  }

}