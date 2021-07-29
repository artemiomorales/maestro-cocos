
import { _decorator, Component, Node, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioLerpVolumeBehaviour')
export class AudioLerpVolumeBehaviour extends Component {

  @property({type: AudioSource, visible: true})
  private _audioSource: AudioSource = null!;
  public get audioSource() {
    return this._audioSource;
  }
  public set audioSource(value: AudioSource) {
    this._audioSource = value;
  }
  
  private _targetVolume: number = 1;
  public get targetVolume() {
    return this._targetVolume;
  }
  public set targetVolume(value: number) {
    this._targetVolume = value;
  }

  private _isPlaying: boolean = false;
  public get isPlaying() {
    return this._isPlaying;
  }
  public set isPlaying(value: boolean) {
    this._isPlaying = value;
  }

  start () {
    if(!this.audioSource) {
      this.audioSource = this.node.getComponent(AudioSource) as AudioSource;
    }
  }

  update () {
    this.audioSource.volume = this.targetVolume;
    if (this.targetVolume >= 1) {
      if(this.audioSource.playing == false) {
          this.audioSource.volume = 1;
      } 
    }
    // Once the playhead is before the clip's start threshold, stop the audio
    else if (this.targetVolume <= 0) {
      this.audioSource.volume = 0;
    }

    if(this.isPlaying && this.audioSource.playing === false) {
      this.audioSource.play();
    }

    else if(!this.isPlaying && this.audioSource.playing) {
      this.audioSource.pause();
    }


  }
}
