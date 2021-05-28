
import { _decorator, Component, Node, EventHandler } from 'cc';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

@ccclass('GenericActionData')
export class GenericActionData extends ActionData {
  
  @property({type: [EventHandler], visible: true})
  private _action: EventHandler[] = [];
  public get action() {
    return this._action;
  }
  public set action(value: EventHandler[]) {
    this._action = value;
  }

  performAction (callingObject: Node) {
    EventHandler.emitEvents(this.action);
  }

}