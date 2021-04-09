
import { _decorator, Component } from 'cc';
import ActionTrigger from './actionTrigger';

const { ccclass, property } = _decorator;

@ccclass('ActionTriggerBehaviour')
export class ActionTriggerBehaviour extends Component {

  @property({visible: true})
  private _logCallersOnRaise: Boolean = false;
  public get logCallersOnRaise() {
    return this._logCallersOnRaise;
  }
  public set logCallersOnRaise(value: Boolean) {
    this._logCallersOnRaise = value;
  }

  @property({type: ActionTrigger, visible: true})
  private _actionTrigger: ActionTrigger = null!;
  public get actionTrigger() {
    return this._actionTrigger;
  }
  public set actionTrigger(value: ActionTrigger) {
    this._actionTrigger = value;
  }
    
  onLoad () {
    this.initialize();
  }

  initialize() {
    this.actionTrigger.initialize();
  }

  start () {
    if(this.actionTrigger.active === false) {
      return;
    }

    if(this.actionTrigger.triggerOnStart === true) {
      this.callPerformActions(`${this.node.name} : (scene ${this.node.scene.name})`);
    }
  }

  callPerformActions(callingObject: string) {
    if(!callingObject || callingObject === "") {
      throw "You must specify a calling game object.";
    }

    if(this.actionTrigger.active === false) {
      return;
    }

    if(this.logCallersOnRaise === true) {
      console.log("Action triggered on " + this.node);
      console.log("Called by " + callingObject);
      console.log("-------------------------")
    }

    if(this.actionTrigger.hasDelay === false) {
     this.actionTrigger.performActions(this.node);
    } else {
      setTimeout(() => {
        this.actionTrigger.performActions(this.node);
      }, this.actionTrigger.delay)
    }
  }

}