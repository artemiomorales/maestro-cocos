
import { _decorator, Component, Node } from 'cc';
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

  @property({type:[ActionTriggerBehaviourItem], visible: true})
  public _actionTriggerBehaviours: ActionTriggerBehaviourItem[] = [];
  public get actionTriggerBehaviours() {
    return this._actionTriggerBehaviours;
  }
  public set actionTriggerBehaviours(value: ActionTriggerBehaviourItem[]) {
    this._actionTriggerBehaviours = value;
  }

  callPerformActionsByKey(key: string) {
    console.log(key);
    const item = this.actionTriggerBehaviours.find(x => x.key === key);
    if(item) {
      item.actionTriggerBehaviour.callPerformActions(this.node.name);
    } else {
      throw "Unable to find key in ActionTriggerBehaviourCollection";
    }
  }

}
