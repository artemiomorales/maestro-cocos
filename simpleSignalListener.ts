import { _decorator, Component, Node, find, EventHandler } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from './constants';
import AppSettings from './persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('SimpleSignalListener')
export class SimpleSignalListener extends Component {

    @property({type: Node})
    public appSettingsNode: Node = null!;
    private appSettings: AppSettings = null!;

    @property({type: SIMPLE_EVENT, visible: true})
    private _simpleSignal: number = null!;
    public get simpleSignal() {
      return this._simpleSignal;
    }
    public set simpleSignal(value: number) {
      this._simpleSignal = value;
    }

    @property({type: [EventHandler], visible: true})
    private _action: EventHandler[] = [];
    public get action() {
      return this._action;
    }
    public set action(value: EventHandler[]) {
      this._action = value;
    }

    onLoad () {
      this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
      this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

      this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[this.simpleSignal], () => {
        EventHandler.emitEvents(this.action);
      });
    }
}
