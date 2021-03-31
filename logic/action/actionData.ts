
import AppSettings from '../../persistentData/appSettings';
import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS } from '../../constants';
const { ccclass, property } = _decorator;

@ccclass('ActionData')
export default class ActionData {

    @property({type: Node, visible: false})
    public appSettingsNode: Node = null!;
    protected appSettings: AppSettings = null!;

    initialize() {
      this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
      this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    }

    performAction (callingObject: Node) { }

}