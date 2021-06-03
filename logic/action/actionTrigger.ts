
import { _decorator, Node, CCInteger } from 'cc';
import SimpleEventActionData from './simpleEventActionData';
import ComplexEventActionData from './complexEventActionData';
import { BoolActionData } from './boolActionData';
import { IntActionData } from './intActionData';
import { GenericActionData } from './genericActionData';
import { SimpleConditionResponseActionData } from './simpleConditionResponseActionData';
import { ComplexConditionResponseActionData } from './complexConditionResponseActionData';

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

  @property({type: [BoolActionData], visible: true})
  public _boolActionData: BoolActionData[] = [];
  private get boolActionData() {
    return this._boolActionData;
  }
  private set boolActionData(value: BoolActionData[]) {
    this._boolActionData = value;
  }

  @property({type: [IntActionData], visible: true})
  public _intActionData: IntActionData[] = [];
  private get intActionData() {
    return this._intActionData;
  }
  private set intActionData(value: IntActionData[]) {
    this._intActionData = value;
  }

  @property({type: [SimpleConditionResponseActionData], visible: true})
  public _simpleConditionResponseActionData: SimpleConditionResponseActionData[] = [];
  private get simpleConditionResponseActionData() {
    return this._simpleConditionResponseActionData;
  }
  private set simpleConditionResponseActionData(value: SimpleConditionResponseActionData[]) {
    this._simpleConditionResponseActionData = value;
  }

  @property({type: [ComplexConditionResponseActionData], visible: true})
  public _complexConditionResponseActionData: ComplexConditionResponseActionData[] = [];
  private get complexConditionResponseActionData() {
    return this._complexConditionResponseActionData;
  }
  private set complexConditionResponseActionData(value: ComplexConditionResponseActionData[]) {
    this._complexConditionResponseActionData = value;
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

  @property({type: [GenericActionData], visible: true})
  public _genericActionData: GenericActionData[] = [];
  private get genericActionData() {
    return this._genericActionData;
  }
  private set genericActionData(value: GenericActionData[]) {
    this._genericActionData = value;
  }

  initialize () {
    // if(this.boolActionData.length === 0) {
    //   this.boolActionData = null!;
    // }
    // if(this.intActionData.length === 0) {
    //   this.intActionData = null!;
    // }
    // if(this.simpleConditionResponseActionData.length === 0) {
    //   this.simpleConditionResponseActionData = null!;
    // }
    // if(this.complexConditionResponseActionData.length === 0) {
    //   this.complexConditionResponseActionData = null!;
    // }
    // if(this.simpleEventActionData.length === 0) {
    //   this.simpleEventActionData = null!;
    // }
    // if(this.complexEventActionData.length === 0) {
    //   this.complexEventActionData = null!;
    // }
    // if(this.genericActionData.length === 0) {
    //   this.genericActionData = null!;
    // }

    for(let i=0; i<this.boolActionData.length; i++) {
      this.boolActionData[i].initialize();
    }
    for(let i=0; i<this.intActionData.length; i++) {
      this.intActionData[i].initialize();
    }
    for(let i=0; i<this.simpleConditionResponseActionData.length; i++) {
      this.simpleConditionResponseActionData[i].initialize();
    }
    for(let i=0; i<this.complexConditionResponseActionData.length; i++) {
      this.complexConditionResponseActionData[i].initialize();
    }
    for(let i=0; i<this.simpleEventActionData.length; i++) {
      this.simpleEventActionData[i].initialize();
    }
    for(let i=0; i<this.complexEventActionData.length; i++) {
      this.complexEventActionData[i].initialize();
    }
    for(let i=0; i<this.genericActionData.length; i++) {
      this.genericActionData[i].initialize();
    }
  }

  performActions(callingObject: Node) {
    if(this.boolActionData) {
      for(let i=0; i<this.boolActionData.length; i++) {
        this.boolActionData[i].performAction(callingObject);
      }
    }
    if(this.intActionData) {
      for(let i=0; i<this.intActionData.length; i++) {
        this.intActionData[i].performAction(callingObject);
      }
    }
    if(this.simpleConditionResponseActionData) {
      for(let i=0; i<this.simpleConditionResponseActionData.length; i++) {
        this.simpleConditionResponseActionData[i].performAction(callingObject);
      }
    }
    if(this.complexConditionResponseActionData) {
      for(let i=0; i<this.complexConditionResponseActionData.length; i++) {
        this.complexConditionResponseActionData[i].performAction(callingObject);
      }
    }
    if(this.simpleEventActionData) {
      for(let i=0; i<this.simpleEventActionData.length; i++) {
        this.simpleEventActionData[i].performAction(callingObject);
      }
    }
    if(this.complexEventActionData) {
      for(let i=0; i<this.complexEventActionData.length; i++) {
        this.complexEventActionData[i].performAction(callingObject);
      }
    }
    if(this.genericActionData) {
      for(let i=0; i<this.genericActionData.length; i++) {
        this.genericActionData[i].performAction(callingObject);
      }
    }
  }

}