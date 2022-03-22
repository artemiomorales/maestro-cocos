
import { _decorator, Component, Node, CCFloat, AudioSource, Vec2 } from 'cc';
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
  
  @property({type: CCFloat, visible: true})
  private _targetVolume: number = 0;
  public get targetVolume() {
    return this._targetVolume;
  }
  public set targetVolume(value: number) {
    this._targetVolume = value;
  }

  @property({type: Vec2, visible: true})
  private _targetVolumeVec: Vec2 = new Vec2(0,0);
  public get targetVolumeVec() {
    return this._targetVolumeVec;
  }
  public set targetVolumeVec(value: Vec2) {
    this._targetVolumeVec = value;
  }

  start () {
    if(!this.audioSource) {
      this.audioSource = this.node.getComponent(AudioSource) as AudioSource;
    }
  }

  update () {
    // console.log(this.targetVolume);
    if (this.targetVolume >= 1) {
      if(this.audioSource.playing === false) {
          this.audioSource.volume = 1;
          this.audioSource.play();
      } 
    }
    // Once the playhead is before the clip's start threshold, stop the audio
    else if (this.targetVolume <= 0 && this.audioSource.playing === true) {
      this.audioSource.volume = 0;
      this.audioSource.stop();
    }
    else {
      this.audioSource.volume = this.targetVolume;
    }
  }
}