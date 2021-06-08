
import { _decorator, Component, Node, EventHandler, TextAsset } from 'cc';
import { EventHandlerWithVariableReference } from '../eventHandlerWithVariableReference';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

@ccclass('GenericActionData')
export class GenericActionData extends ActionData {

  @property({type: [EventHandlerWithVariableReference], visible: true})
  private _actionReferences: EventHandlerWithVariableReference[] = [];
  public get actionReferences() {
    return this._actionReferences;
  }
  public set actionReferences(value: EventHandlerWithVariableReference[]) {
    this._actionReferences = value;
  }

  performAction (callingObject: Node) {
    for(let i=0; i<this.actionReferences.length; i++) {
      this.actionReferences[i].callActions(callingObject);
    }
  }

}