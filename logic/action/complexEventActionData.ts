import AppSettings from '../../persistentData/appSettings';
import { _decorator, Node, find, CCString, CCBoolean, CCInteger } from 'cc';
import { CONSTANTS, COMPLEX_EVENT, EVENT_TYPE, SIMPLE_EVENT } from '../../constants';
import ActionData from './actionData';
import ComplexPayload from '../../complexPayload';
const { ccclass, property } = _decorator;

@ccclass('ComplexEventActionData')
export default class ComplexEventActionData extends ActionData {

    @property({type: [COMPLEX_EVENT], visible: true})
    private _complexEvent: number = null!;

    public get complexEvent() {
      return this._complexEvent;
    }
    public set complexEvent(value: number) {
      this._complexEvent = value;
    }

    @property({type: [ComplexPayload], visible: true})
    private _complexPayload: ComplexPayload[] = [null!];

    public get complexPayload() {
      return this._complexPayload;
    }
    public set complexPayload(value: ComplexPayload[]) {
      this._complexPayload = value;
    }

    performAction (callingObject: Node) {
        this.appSettings.triggerSimpleEvent(callingObject, Object.keys(COMPLEX_EVENT)[this.complexEvent]);
    }

}