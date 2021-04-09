
import { _decorator, Node, find } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, DATA_TYPE } from '../constants';
import AppSettings from './appSettings';
import { AudioClipDictionary } from './audioClipDictionary';
import BoolDictionary from './boolDictionary';
import FloatDictionary from './floatDictionary';
import IntDictionary from './intDictionary';
import StringDictionary from './stringDictionary';
const { ccclass, property } = _decorator;

@ccclass('ComplexEventConfigurableTrigger')
export class ComplexEventConfigurableTrigger {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  protected appSettings: AppSettings = null!;    

  @property({type: COMPLEX_EVENT, visible: true})
  private _complexEvent: number = null!;

  public get complexEvent() {
    return this._complexEvent;
  }
  public set complexEvent(value: number) {
    this._complexEvent = value;
  }

  @property({type: [StringDictionary], visible: true})
  private _stringDictionary: StringDictionary[] = [];

  public get stringDictionary() {
    return this._stringDictionary;
  }
  public set stringDictionary(value: StringDictionary[]) {
    this._stringDictionary = value;
  }

  @property({type: [IntDictionary], visible: true})
  private _intDictionary: IntDictionary[] = [];

  public get intDictionary() {
    return this._intDictionary;
  }
  public set intDictionary(value: IntDictionary[]) {
    this._intDictionary = value;
  }

  @property({type: [FloatDictionary], visible: true})
  private _floatDictionary: FloatDictionary[] = [];

  public get floatDictionary() {
    return this._floatDictionary;
  }
  public set floatDictionary(value: FloatDictionary[]) {
    this._floatDictionary = value;
  }

  @property({type: [BoolDictionary], visible: true})
  private _boolDictionary: BoolDictionary[] = [];

  public get boolDictionary() {
    return this._boolDictionary;
  }
  public set boolDictionary(value: BoolDictionary[]) {
    this._boolDictionary = value;
  }

  @property({type: [AudioClipDictionary], visible: true})
  private _audioClipDictionary: AudioClipDictionary[] = [];

  public get audioClipDictionary() {
    return this._audioClipDictionary;
  }
  public set audioClipDictionary(value: AudioClipDictionary[]) {
    this._audioClipDictionary = value;
  }

  initialize() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  raiseEvent(callingObject: Node) {
    let complexPayload = new ComplexPayload();
    if(this.stringDictionary.length > 0) {
      complexPayload = this.getStringValues(complexPayload);
    }
    if(this.floatDictionary.length > 0) {
      complexPayload = this.getFloatValues(complexPayload);
    }
    if(this.boolDictionary.length > 0) {
      complexPayload = this.getBoolValues(complexPayload);
    }
    if(this.intDictionary.length > 0) {
      complexPayload = this.getIntValues(complexPayload);
    }
    if(this.audioClipDictionary.length > 0) {
      complexPayload = this.getAudioClipValues(complexPayload);
    }

    this.appSettings.triggerComplexEvent(callingObject, Object.keys(COMPLEX_EVENT)[this.complexEvent], complexPayload);
  }

  getStringValues(complexPayload: ComplexPayload) {
    for(let i=0; i<this.stringDictionary.length; i++) {
      const datum = this.stringDictionary[i]
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.value.name);
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.stringType], datum.value.name);
      }
    }
    return complexPayload;
  }

  getFloatValues(complexPayload: ComplexPayload) {
    for(let i=0; i<this.floatDictionary.length; i++) {
      const datum = this.floatDictionary[i]
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.value);
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.floatType], datum.value);
      }
    }
    return complexPayload;
  }

  getBoolValues(complexPayload: ComplexPayload) {
    for(let i=0; i<this.boolDictionary.length; i++) {
      const datum = this.boolDictionary[i]
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.value);
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.boolType], datum.value);
      }
    }
    return complexPayload;
  }

  getIntValues(complexPayload: ComplexPayload) {
    for(let i=0; i<this.intDictionary.length; i++) {
      const datum = this.intDictionary[i]
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.value);
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.intType], datum.value);
      }
    }
    return complexPayload;
  }

  getAudioClipValues(complexPayload: ComplexPayload) {
    for(let i=0; i<this.audioClipDictionary.length; i++) {
      const datum = this.audioClipDictionary[i]
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.value);
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType], datum.value);
      }
    }
    return complexPayload;
  }

}