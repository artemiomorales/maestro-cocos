
import { _decorator, Component, Node, Prefab, AudioClip, instantiate, AudioSourceComponent, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioElement')
export class AudioElement {

  @property({type: AudioClip, visible: true})
  private _audioClip: AudioClip = null!;
  public get audioClip() {
    return this._audioClip;
  }
  public set audioClip(value: AudioClip) {
    this._audioClip = value;
  }

  @property({type: AudioSourceComponent, visible: true})
  private _audioSource: AudioSourceComponent = null!;
  public get audioSource() {
    return this._audioSource;
  }
  public set audioSource(value: AudioSourceComponent) {
    this._audioSource = value;
  }

  constructor(audioObject: Node, audioClip: AudioClip, loop: boolean, volume: number) {
    this.audioClip = audioClip;
    this.audioSource = audioObject.getComponent(AudioSourceComponent) as AudioSourceComponent;
    this.audioSource.clip = audioClip;
    this.audioSource.loop = loop;
    this.audioSource.volume = volume;
    this.audioSource.play();
  }

  fadeOut(fadeTime: number = .5) {
    tween(this.audioSource)
      .to(fadeTime, {volume: 0}, {
        easing: 'quadInOut',
        'onComplete': () => {
          this.audioClip.stop();
        }
      })
      .start();
  }

}
