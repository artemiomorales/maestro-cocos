
import { _decorator, Component, Node, director, CCString, TextAsset, find, Director } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS } from '../constants';
import AppSettings from '../persistentData/appSettings';

const { ccclass, property } = _decorator;

@ccclass('Initializer')
export class Initializer extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: TextAsset, visible: true})
  private _triggerSceneLoadKey: TextAsset = null!;

  public get triggerSceneLoadKey() {
    return this._triggerSceneLoadKey;
  }

  @property({type: TextAsset, visible: true})
  private _bootstrapScene: TextAsset = null!;

  public get bootstrapScene() {
    return this._bootstrapScene;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    let complexPayload = new ComplexPayload();
    complexPayload.set(this.triggerSceneLoadKey.name, this.bootstrapScene.name);

    setTimeout(() => {
      this.appSettings.triggerComplexEvent(this.node, Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_SCENE_LOAD], complexPayload);
    }, 1)  
  }

}
