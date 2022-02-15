
import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { ActionTriggerBehaviour } from './actionTriggerBehaviour';
const { ccclass, property } = _decorator;

@ccclass('ActionTriggerBehaviourItem')
export class ActionTriggerBehaviourItem {

  @property({visible: true})
  public _key: string = "";
  public get key() {
    return this._key;
  }
  public set key(value: string) {
    this._key = value;
  }

  @property({visible: true})
  private _executeOnForward = true;
  public get executeOnForward() {
    return this._executeOnForward;
  }
  public set executeOnForward(value: boolean) {
    this._executeOnForward = value;
  }

  // @property({visible: true})
  // private _executeOnReverse = false;
  // public get executeOnReverse() {
  //   return this._executeOnReverse;
  // }
  // public set executeOnReverse(value: boolean) {
  //   this._executeOnReverse = value;
  // }

  @property({type:ActionTriggerBehaviour, visible: true})
  public _actionTriggerBehaviour: ActionTriggerBehaviour = null!;
  public get actionTriggerBehaviour() {
    return this._actionTriggerBehaviour;
  }
  public set actionTriggerBehaviour(value: ActionTriggerBehaviour) {
    this._actionTriggerBehaviour = value;
  }

}

@ccclass('ActionTriggerBehaviourCollection')
export default class ActionTriggerBehaviourCollection extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  @property({type:[ActionTriggerBehaviourItem], visible: true})
  public _actionTriggerBehaviours: ActionTriggerBehaviourItem[] = [];
  public get actionTriggerBehaviours() {
    return this._actionTriggerBehaviours;
  }
  public set actionTriggerBehaviours(value: ActionTriggerBehaviourItem[]) {
    this._actionTriggerBehaviours = value;
  }

  callPerformActionsByKey(key: string) {
    const item = this.actionTriggerBehaviours.find(x => x.key === key);

    if(item) {
      // Execute action depending on action settings and whether we
      // are moving forward or backward
      if(this.appSettings.getIsReversing(this.node) === false) {
        if(item.executeOnForward === true) {
          item.actionTriggerBehaviour.callPerformActions(this.node.name);
        }
      } else {
        // Due to a bug in Cocos Creator wherein reverse events are fired
        // when they're not supposed to, reverse events are not currently supported

        // if(item.executeOnReverse === true && Math.abs(this.sequenceController.currentTime - item.reverseTimeSignature) < .05) {
        //   console.log("executing");
        //   item.actionTriggerBehaviour.callPerformActions(this.node.name);
        // }
      }
        
    } else {
      throw "Unable to find key in ActionTriggerBehaviourCollection";
    }
  }

}
