
import { _decorator, Component, Node, CCFloat, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioFadePlayBehaviour')
export class AudioFadePlayBehaviour extends Component {

  @property({type: AudioSource, visible: true})
  private _audioSource: AudioSource = null!;
  public get audioSource() {
    return this._audioSource;
  }
  public set audioSource(value: AudioSource) {
    this._audioSource = value;
  }

  @property({visible: true})
  private _reset: boolean = false;
  public get reset() {
    return this._reset;
  }
  public set reset(value: boolean) {
    this._reset = value;
  }

  @property({type: CCFloat, visible: true})
  private _volume: number = 1;
  public get volume() {
    return this._volume;
  }
  public set volume(value: number) {
    this._volume = value;
  }

  start () {
    if(!this.audioSource) {
      this.audioSource = this.node.getComponent(AudioSource) as AudioSource;
    }
  }

  update () {
    if(this.reset) {
      this.audioSource.stop();
    }
    if(!this.reset)
      if(!this.audioSource.playing) {
        this.audioSource.play();
      }
      this.audioSource.volume = this.volume;
  }
}