
import { _decorator, Component, Node } from 'cc';
import { AudioClipReference } from './audioClipReference';
import { VariableReferenceDictionary } from './variableReferenceDictionary';
const { ccclass, property } = _decorator;

@ccclass('AudioClipReferenceDictionary')
export class AudioClipReferenceDictionary extends VariableReferenceDictionary {

  @property({type: AudioClipReference, visible: true})
  private _audioClipReference: AudioClipReference = null!;

  public get audioClipReference() {
    return this._audioClipReference;
  }
  public set audioClipReference(value: AudioClipReference) {
    this._audioClipReference = value;
  }

  getValue (callingObject: Node) {
    return this.audioClipReference.getValue(callingObject);
  }

}