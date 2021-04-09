
import { _decorator, Component, CCString, Node, CCInteger, resources, TextAsset } from 'cc';
import { DATA_TYPE } from '../constants';
import VariableDictionary from './variableDictionary';
const { ccclass, property } = _decorator;

@ccclass('IntDictionary')
export default class IntDictionary extends VariableDictionary{

  @property({type: CCInteger, visible: true})
  private _value: number = 0;

  public get value() {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
  }

}