
import { _decorator, Component, Node, find, AudioSourceComponent } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, DATA_TYPE } from '../constants';
import AppSettings from '../persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('AudioSourceController')
export class AudioSourceController extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  private audioSourceComponent: AudioSourceComponent = null!

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.audioSourceComponent = this.node.getComponent(AudioSourceComponent) as AudioSourceComponent;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.PLAY_AUDIO], (complexPayload: ComplexPayload) => {
      console.log("audio triggered");
      this.playAudio(complexPayload);
    })
  }

  playAudio(complexPayload: ComplexPayload) {
    let audioClip = complexPayload.get(Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType]);
    this.audioSourceComponent.playOneShot(audioClip);
  }

}
