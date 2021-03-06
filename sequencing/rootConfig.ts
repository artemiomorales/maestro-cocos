
import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../constants';
import AppSettings from '../persistentData/appSettings';
import MasterSequence from './masterSequence';

const { ccclass, property, executionOrder } = _decorator;

@ccclass('RootConfig')
@executionOrder(20)
export class RootConfig extends Component {

  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  @property({type: [MasterSequence], visible: true})
  private _masterSequences: MasterSequence[] = [null!];
  public get masterSequences() {
    return this._masterSequences;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    // this.configure();
  }

  configure() {
    console.log("root config is configuring");
    // Validate before proceeding with configuration 
    for (let i = 0; i < this.masterSequences.length; i++) {
      if (this.masterSequences[i] == null) {
        console.error("Master Sequence is missing on RootConfig", this);
        return;
      }
    }

    for (let i = 0; i < this.masterSequences.length; i++) {
      this.masterSequences[i].init();
    }

    this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE])
  }

}