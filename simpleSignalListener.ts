import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from './constants';
import AppSettings from './persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('SimpleSignalListener')
export class SimpleSignalListener extends Component {

    @property({type: Node})
    public appSettingsNode: Node = null!;
    private appSettings: AppSettings = null!;

    @property({type: SIMPLE_EVENT})
    private maestroEvent = null;

    onLoad () {
      this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
      this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    }

    start () {
      console.log(this.appSettings.getSwipeForce(this.node));
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
