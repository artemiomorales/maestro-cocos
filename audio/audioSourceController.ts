
import { _decorator, Component, Node, find, AudioSourceComponent, Prefab, TextAsset, instantiate, game, AudioClip } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, DATA_TYPE } from '../constants';
import AppSettings from '../persistentData/appSettings';
import { AudioElement } from './audioElement';
const { ccclass, property } = _decorator;

@ccclass('AudioSourceController')
export class AudioSourceController extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  private _oneShotAudioSource: AudioSourceComponent = null!
  private get oneShotAudioSource() {
    return this._oneShotAudioSource;
  }
  private set oneShotAudioSource(value: AudioSourceComponent) {
    this._oneShotAudioSource = value;
  }

  @property({type: Prefab, visible: true})
  private _audioElementPrefab: Prefab = null!;
  private get audioElementPrefab() {
    return this._audioElementPrefab;
  }
  private set audioElementPrefab(value: Prefab) {
    this._audioElementPrefab = value;
  }

  private _audioElements: AudioElement[] = [];
  private get audioElements() {
    return this._audioElements;
  }
  private set audioElements(value: AudioElement[]) {
    this._audioElements = value;
  }

  @property({type: TextAsset, visible: true})
  private _loopAudioKey: TextAsset = null!;
  public get loopAudioKey() {
    return this._loopAudioKey;
  }
  public set loopAudioKey(value: TextAsset) {
    this._loopAudioKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _volumeKey: TextAsset = null!;
  public get volumeKey() {
    return this._volumeKey;
  }
  public set volumeKey(value: TextAsset) {
    this._volumeKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _fadeOutTimeKey: TextAsset = null!;
  public get fadeOutTimeKey() {
    return this._fadeOutTimeKey;
  }
  public set fadeOutTimeKey(value: TextAsset) {
    this._fadeOutTimeKey = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    this.oneShotAudioSource = this.node.getComponent(AudioSourceComponent) as AudioSourceComponent;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.PLAY_AUDIO], this.playAudio, this);
    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.PLAY_ONE_SHOT], this.playOneShot, this);
    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.FADE_OUT_AUDIO], this.fadeOutAudio, this);
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.PLAY_AUDIO], this.playAudio, this);
    this.appSettingsNode.off(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.PLAY_ONE_SHOT], this.playOneShot, this);
    this.appSettingsNode.off(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.FADE_OUT_AUDIO], this.fadeOutAudio, this);
  }

  playAudio(complexPayload: ComplexPayload) {
    const audioClip = complexPayload.get(this.node, Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType]);
    const loopSetting = complexPayload.get(this.node, this.loopAudioKey.name);
    const volumeSetting = complexPayload.get(this.node, this.volumeKey.name);

    let loop = false;
    let volume = 1;

    if(loopSetting) {
      loop = loopSetting;
    }

    if(volumeSetting) {
      volume = volumeSetting;
    }

    for(let i=0; i<this.audioElements.length; i++) {
      const audioElement = this.audioElements[i];
      if(audioElement.audioClip == audioClip) {
        if(!audioElement.audioSource.playing) {
          audioElement.audioSource.play();
        }
        return;
      }
    }

    const audioObject = instantiate(this.audioElementPrefab);
    audioObject.setParent(this.node);
    const audioElement = new AudioElement(audioObject, audioClip, loop, volume);
    this.audioElements.push(audioElement);
  }

  playOneShot(complexPayload: ComplexPayload) {
    const audioClip = complexPayload.get(this.node, Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType]);
    this.oneShotAudioSource.playOneShot(audioClip);
  }

  fadeOutAudio(complexPayload: ComplexPayload) {
    const audioClip = complexPayload.get(this.node, Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType]);
    let fadeOutTime = complexPayload.get(this.node, this.fadeOutTimeKey.name);
    if(!fadeOutTime) {
      fadeOutTime = 2;
    }
    if(audioClip) {
      this.fadeOutClip(audioClip, fadeOutTime);
    } else {
      this.fadeOutAll(fadeOutTime);
    }
  }

  fadeOutClip(audioClip: AudioClip, fadeOutTime: number) {
    for(let i=0; i<this.audioElements.length; i++) {
      const audioElement = this.audioElements[i];
      if(audioElement.audioClip === audioClip) {
        audioElement.fadeOut(fadeOutTime).then(() => {
          this.fadeOutAudioCallback(audioElement);
        });
      }
    }
  }

  fadeOutAll(fadeOutTime: number) {
    for(let i=0; i<this.audioElements.length; i++) {
      const audioElement = this.audioElements[i];
      audioElement.fadeOut(fadeOutTime).then(() => {
        this.fadeOutAudioCallback(audioElement);
      });
    }
  }

  fadeOutAudioCallback(audioElement: AudioElement) {
    const audioElements: AudioElement[] = [];
    for(let i=0; i<this.audioElements.length; i++) {
      if(this.audioElements[i] === audioElement) {
        this.audioElements[i].audioSource.node.destroy();
      } else {
        audioElements.push(this.audioElements[i]);
      }
    }
    this.audioElements = audioElements;
  }

}
