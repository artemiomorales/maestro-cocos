
import { AudioClip, _decorator } from 'cc';
import VariableDictionary from './variableDictionary';
const { ccclass, property } = _decorator;

@ccclass('AudioClipDictionary')
export class AudioClipDictionary extends VariableDictionary {

  @property({type: AudioClip, visible: true})
  private _value: AudioClipDictionary = null!;

  public get value() {
    return this._value;
  }
  public set value(value: AudioClipDictionary) {
    this._value = value;
  }


}