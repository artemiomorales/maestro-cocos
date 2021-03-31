
import { _decorator, Component, Node } from 'cc';
import { RegisterableScriptableObject } from './registerableScriptableObject';
const { ccclass, property } = _decorator;

@ccclass('PersistentDataObject')
export class PersistentDataObject extends RegisterableScriptableObject {
    
    private _callerObject: Node | null = null;
    private get callerObject() {
      return this._callerObject;
    }
    private set callerObject(value: Node | null) {
      this._callerObject = value;
    }

    private _callerScene: String = ""!;
    private get callerScene() {
      return this._callerScene;
    }
    private set callerScene(value: String) {
      this._callerScene = value;
    }

    private _callerName: String = ""!;
    private get callerName() {
      return this._callerName;
    }
    private set callerName(value: String) {
      this._callerName = value;
    }

    callerRegistered()
    {
        if (this.callerObject == null && this.callerName.length < 1) {
            console.log("Caller not registered on " + this.name + ". Are you accessing this object directly? Please use an event trigger or variable reference instead.", this);
            return false;
        }

        return true;
    }

    clearCaller()
    {
        this.callerObject = null;
        this.callerScene = "";
        this.callerName = "";
    }

}