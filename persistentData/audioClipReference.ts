
import { AudioClip, Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioClipReference')
export class AudioClipReference {

  @property({type: AudioClip, visible: true})
  private _value: AudioClip = null!;

  private get value() {
    return this._value;
  }
  private set value(value: AudioClip) {
    this._value = value;
  }

  getValue(callingObject: Node) {
    return this.value;
  }

}