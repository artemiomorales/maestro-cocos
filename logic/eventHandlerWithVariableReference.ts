
import { _decorator, Component, Node, EventHandler, TextAsset } from 'cc';
import { GetSceneData } from '../utils';
const { ccclass, property } = _decorator;

@ccclass('EventHandlerWithVariableReference')
export class EventHandlerWithVariableReference {
  
  @property({type: TextAsset, visible: true})
  private _variableReference: TextAsset = null!;
  public get variableReference() {
    return this._variableReference;
  }
  public set variableReference(value: TextAsset) {
    this._variableReference = value;
  }

  @property({visible: true})
  private _useVariableForCustomData: boolean = false;
  public get useVariableForCustomData() {
    return this._useVariableForCustomData;
  }
  public set useVariableForCustomData(value: boolean) {
    this._useVariableForCustomData = value;
  }

  @property({type: EventHandler, visible: true})
  private _action: EventHandler = new EventHandler();
  public get action() {
    return this._action;
  }
  public set action(value: EventHandler) {
    this._action = value;
  }

  callActions(callingObject: Node) {
    if(this.useVariableForCustomData) {
      const sceneData = GetSceneData();
      const value = sceneData.getValue(callingObject, this.variableReference);
      this.action.emit([value])
    } else {
      this.action.emit([this.action.customEventData]);
    }
  }

}
