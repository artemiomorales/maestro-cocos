
import { _decorator, Node, CCInteger } from 'cc';
import SimpleEventActionData from './simpleEventActionData';
import ComplexEventActionData from './complexEventActionData';

const { ccclass, property } = _decorator;

@ccclass('ActionTrigger')
export default class ActionTrigger {

  @property({visible: true})
  private _active: Boolean = true;
  public get active() {
    return this._active;
  }
  public set active(value: Boolean) {
    this._active = value;
  }

  @property({visible: true})
  private _triggerOnStart: Boolean = false;
  public get triggerOnStart() {
    return this._triggerOnStart;
  }
  public set triggerOnStart(value: Boolean) {
    this._triggerOnStart = value;
  }

  @property({visible: true})
  private _hasDelay: Boolean = false;
  public get hasDelay() {
    return this._hasDelay;
  }
  public set hasDelay(value: Boolean) {
    this._hasDelay = value;
  }

  @property({type: CCInteger, visible: true})
  private _delay: number = 0;
  public get delay() {
    return this._delay;
  }
  public set delay(value: number) {
    this._delay = value;
  }

  @property({visible: true})
  private _debug: Boolean = false;
  public get debug() {
    return this._debug;
  }
  public set debug(value: Boolean) {
    this._debug = value;
  }

  @property({type: [SimpleEventActionData], visible: true})
  public _simpleEventActionData: SimpleEventActionData[] = [];
  private get simpleEventActionData() {
    return this._simpleEventActionData;
  }
  private set simpleEventActionData(value: SimpleEventActionData[]) {
    this._simpleEventActionData = value;
  }

  @property({type: [ComplexEventActionData], visible: true})
  public _complexEventActionData: ComplexEventActionData[] = [];
  private get complexEventActionData() {
    return this._complexEventActionData;
  }
  private set complexEventActionData(value: ComplexEventActionData[]) {
    this._complexEventActionData = value;
  }

  initialize () {
    for(let i=0; i<this.simpleEventActionData.length; i++) {
      this.simpleEventActionData[i].initialize();
    }
    for(let i=0; i<this.complexEventActionData.length; i++) {
      this.complexEventActionData[i].initialize();
    }
  }

  performActions(callingObject: Node) {
    for(let i=0; i<this.simpleEventActionData.length; i++) {
      this.simpleEventActionData[i].performAction(callingObject);
    }
    for(let i=0; i<this.complexEventActionData.length; i++) {
      this.complexEventActionData[i].performAction(callingObject);
    }
  }

}