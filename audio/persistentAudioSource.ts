
import { _decorator, Component, Node, AudioSourceComponent, find, CCFloat } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../constants';
import AppSettings from '../persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('PersistentAudioSource')
export class PersistentAudioSource extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: AudioSourceComponent, visible: false})
  private _audioSource: AudioSourceComponent = null!;
  public get audioSource() {
    return this._audioSource;
  }
  public set audioSource(value: AudioSourceComponent) {
    this._audioSource = value;
  }

  private _resumeTime: number = 0;
  public get resumeTime() {
    return this._resumeTime;
  }
  public set resumeTime(value: number) {
    this._resumeTime = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    this.audioSource = this.getComponent(AudioSourceComponent) as AudioSourceComponent;
    
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED], this.saveCurrentTime, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED], this.resumeAudio, this);
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED], this.saveCurrentTime, this);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED], this.resumeAudio, this);
  }

  saveCurrentTime() {
    this.resumeTime = this.audioSource.currentTime;
  }

  resumeAudio() {
    this.audioSource.play();
    this.audioSource.currentTime = this.resumeTime;
  }

}
