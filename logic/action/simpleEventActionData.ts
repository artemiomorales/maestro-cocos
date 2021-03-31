import AppSettings from '../../persistentData/appSettings';
import { _decorator, Node, find } from 'cc';
import { CONSTANTS, COMPLEX_EVENT, EVENT_TYPE, SIMPLE_EVENT } from '../../constants';
import ActionData from './actionData';
const { ccclass, property } = _decorator;

@ccclass('SimpleEventActionData')
export default class SimpleEventActionData extends ActionData {

    @property({type: SIMPLE_EVENT, visible: true})
    private _simpleEvent: number = null!;

    public get simpleEvent() {
      return this._simpleEvent;
    }
    public set simpleEvent(value: number) {
      this._simpleEvent = value;
    }

    performAction (callingObject: Node) {
        this.appSettings.triggerSimpleEvent(callingObject, Object.keys(SIMPLE_EVENT)[this.simpleEvent]);
    }

}