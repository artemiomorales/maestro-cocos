
import { _decorator, Node } from 'cc';
import { COMPLEX_EVENT } from '../../constants';
import ActionData from './actionData';
import { ComplexEventConfigurableTrigger } from '../../persistentData/complexEventConfigurableTrigger';
const { ccclass, property } = _decorator;

@ccclass('ComplexEventActionData')
export default class ComplexEventActionData extends ActionData {

    @property({type: [ComplexEventConfigurableTrigger], visible: true})
    private _complexEventConfigurableTriggers: ComplexEventConfigurableTrigger[] = [new ComplexEventConfigurableTrigger()];

    public get complexEventConfigurableTriggers() {
      return this._complexEventConfigurableTriggers;
    }
    public set complexEventConfigurableTriggers(value: ComplexEventConfigurableTrigger[]) {
      this._complexEventConfigurableTriggers = value;
    }

    initialize () {
      for(let i=0; i<this.complexEventConfigurableTriggers.length; i++) {
        this.complexEventConfigurableTriggers[i].initialize();
      }
    }

    performAction (callingObject: Node) {
      for (let i=0; i<this.complexEventConfigurableTriggers.length; i++) {
        this.complexEventConfigurableTriggers[i].raiseEvent(callingObject);
      }
    }

}