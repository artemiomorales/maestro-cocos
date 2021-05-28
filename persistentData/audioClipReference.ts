
import { AudioClip, find, Node, _decorator } from 'cc';
import { CONSTANTS } from '../constants';
import { SceneData } from './sceneData';
import { VariableReference }  from './variableReference';
const { ccclass, property } = _decorator;

@ccclass('AudioClipReference')
export class AudioClipReference extends VariableReference {

  @property({type: AudioClip, visible: true})
  private _value: AudioClip = null!;

  private get value() {
    return this._value;
  }
  private set value(value: AudioClip) {
    this._value = value;
  }

  getValue(callingObject: Node) {
    if(this.useReference) {
      const sceneData = this.getSceneData();

    }
    console.log(this.value);
    return this.value;
  }

  setValue(callingObject: Node) {
    const sceneData = this.getSceneData();

  }

}