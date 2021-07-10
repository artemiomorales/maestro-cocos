import { _decorator, Component, Node, find, EventHandler, TextAsset } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from './constants';
import AppSettings from './persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('SimpleSignalListener')
export class SimpleSignalListener extends Component {

    @property({type: Node, visible: false})
    public appSettingsNode: Node = null!;
    private appSettings: AppSettings = null!;

    @property({visible: true})
    private _active = true;
    public get active() {
      return this._active;
    }
    public set active(value: boolean) {
      this._active = value;
    }

    @property({visible: true})
    private _logOnRaise = false;
    public get logOnRaise() {
      return this._logOnRaise;
    }
    public set logOnRaise(value: boolean) {
      this._logOnRaise = value;
    }

    @property({type: SIMPLE_EVENT, visible: true})
    private _simpleSignal: number = null!;
    public get simpleSignal() {
      return this._simpleSignal;
    }
    public set simpleSignal(value: number) {
      this._simpleSignal = value;
    }

    @property({type: TextAsset, visible: true})
    private _variableReference: TextAsset = null!;
    public get variableReference() {
      return this._variableReference;
    }
    public set variableReference(value: TextAsset) {
      this._variableReference = value;
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

      if(this.simpleSignal) {
        this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[this.simpleSignal], this.performActions, this);
      }

      if(this.variableReference) {
        console.log(this.variableReference.name);
        this.appSettingsNode.on(this.variableReference.name, this.performActions, this);
      }
    }

    onDestroy() {
      if(this.simpleSignal) {
        this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[this.simpleSignal], this.performActions, this);
      }
      if(this.variableReference) {
        this.appSettingsNode.off(this.variableReference.name, this.performActions, this);
      }
    }

    performActions() {
      if(this.active) {
        if(this.logOnRaise) {
          if(this.simpleSignal) {
            console.log(this.name + " was raised by listening to " + Object.keys(SIMPLE_EVENT)[this.simpleSignal])
          }
          if(this.variableReference) {
            console.log(this.name + " was raised by listening to " + this.variableReference.name)
          }
        }
        EventHandler.emitEvents(this.action);
      }
    }

    /// Activate() and Deactivate() exist so that we can change
    /// the sequence controller's status via Cocos editor event handlers
    activate() {
      this.active = true;
    }
    deactivate() {
      this.active = false;
    }
}
