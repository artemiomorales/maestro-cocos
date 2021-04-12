
import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS } from '../constants';
import AppSettings from '../persistentData/appSettings';
import MasterSequence from './masterSequence';

const { ccclass, property } = _decorator;

@ccclass('RootConfig')
export class RootConfig extends Component {

  @property({type: Node, visible: true})
  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  @property({type: [MasterSequence], visible: true})
  private _masterSequences: MasterSequence[] = [];
  public get masterSequences() {
    return this._masterSequences;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  configure() {
    // Validate before proceeding with configuration 
    for (let i = 0; i < this.masterSequences.length; i++) {
        if (this.masterSequences[i] == null) {
            console.error("Master Sequence is missing on RootConfig", this);
            return;
        }
    }

    for (let i = 0; i < this.masterSequences.length; i++) {
        this.masterSequences[i].rootConfig = this;
        this.masterSequences[i].init();
    }
  }

}