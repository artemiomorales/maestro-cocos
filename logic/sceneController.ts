
import { _decorator, Component, Node, find, director } from 'cc';
import AppSettings from '../persistentData/appSettings';
import { CONSTANTS, COMPLEX_EVENT } from '../constants';
import { V2Variable } from '../persistentData/v2Variable';
const { ccclass, property } = _decorator;

@ccclass('SceneController')
export class SceneController extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  load () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_SCENE_LOAD], (targetScene: string) => {
      this.triggerSceneLoad(targetScene);
    })
  }

  triggerSceneLoad (targetScene: string) {
   director.loadScene(targetScene); 
  }

}