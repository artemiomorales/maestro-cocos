
import { _decorator, Node, find } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, DATA_TYPE } from '../constants';
import AppSettings from './appSettings';
import { AudioClipReferenceDictionary } from './audioClipReferenceDictionary';
import { BoolReferenceDictionary } from './boolReferenceDictionary';
import { FloatReferenceDictionary } from './floatReferenceDictionary';
import { IntReferenceDictionary } from './intReferenceDictionary';
import { StringReferenceDictionary } from './stringReferenceDictionary';
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

  @property({type: [StringReferenceDictionary], visible: true})
  private _stringDictionary: StringReferenceDictionary[] = [];

  public get stringDictionary() {
    return this._stringDictionary;
  }
  public set stringDictionary(value: StringReferenceDictionary[]) {
    this._stringDictionary = value;
  }

  @property({type: [IntReferenceDictionary], visible: true})
  private _intDictionary: IntReferenceDictionary[] = [];

  public get intDictionary() {
    return this._intDictionary;
  }
  public set intDictionary(value: IntReferenceDictionary[]) {
    this._intDictionary = value;
  }

  @property({type: [FloatReferenceDictionary], visible: true})
  private _floatDictionary: FloatReferenceDictionary[] = [];

  public get floatDictionary() {
    return this._floatDictionary;
  }
  public set floatDictionary(value: FloatReferenceDictionary[]) {
    this._floatDictionary = value;
  }

  @property({type: [BoolReferenceDictionary], visible: true})
  private _boolDictionary: BoolReferenceDictionary[] = [];

  public get boolDictionary() {
    return this._boolDictionary;
  }
  public set boolDictionary(value: BoolReferenceDictionary[]) {
    this._boolDictionary = value;
  }

  @property({type: [AudioClipReferenceDictionary], visible: true})
  private _audioClipDictionary: AudioClipReferenceDictionary[] = [];

  public get audioClipDictionary() {
    return this._audioClipDictionary;
  }
  public set audioClipDictionary(value: AudioClipReferenceDictionary[]) {
    this._audioClipDictionary = value;
  }

  initialize() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  raiseEvent(callingObject: Node) {
    let complexPayload = new ComplexPayload();
    if(this.boolDictionary.length > 0) {
      complexPayload = this.getBoolValues(callingObject, complexPayload);
    }
    if(this.stringDictionary.length > 0) {
      complexPayload = this.getStringValues(callingObject, complexPayload);
    }
    if(this.floatDictionary.length > 0) {
      complexPayload = this.getFloatValues(callingObject, complexPayload);
    }
    if(this.intDictionary.length > 0) {
      complexPayload = this.getIntValues(callingObject, complexPayload);
    }
    if(this.audioClipDictionary.length > 0) {
      complexPayload = this.getAudioClipValues(callingObject, complexPayload);
    }

    this.appSettings.triggerComplexEvent(callingObject, Object.keys(COMPLEX_EVENT)[this.complexEvent], complexPayload);
  }

  getStringValues(callingObject: Node, complexPayload: ComplexPayload) {
    for(let i=0; i<this.stringDictionary.length; i++) {
      const datum = this.stringDictionary[i];
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.getValue(callingObject));
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.stringType], datum.getValue(callingObject));
      }
    }
    return complexPayload;
  }

  getFloatValues(callingObject: Node, complexPayload: ComplexPayload) {
    for(let i=0; i<this.floatDictionary.length; i++) {
      const datum = this.floatDictionary[i];
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.getValue(callingObject));
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.floatType], datum.getValue(callingObject));
      }
    }
    return complexPayload;
  }

  getBoolValues(callingObject: Node, complexPayload: ComplexPayload) {
    for(let i=0; i<this.boolDictionary.length; i++) {
      console.log(this.boolDictionary);
      const datum = this.boolDictionary[i];
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.getValue(callingObject));
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.boolType], datum.getValue(callingObject));
      }
    }
    return complexPayload;
  }

  getIntValues(callingObject: Node, complexPayload: ComplexPayload) {
    for(let i=0; i<this.intDictionary.length; i++) {
      const datum = this.intDictionary[i];
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.getValue(callingObject));
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.intType], datum.getValue(callingObject));
      }
    }
    return complexPayload;
  }

  getAudioClipValues(callingObject: Node, complexPayload: ComplexPayload) {
    for(let i=0; i<this.audioClipDictionary.length; i++) {
      const datum = this.audioClipDictionary[i];
      if(datum.customKey) {
        complexPayload.set(datum.customKey.name, datum.getValue(callingObject));
      } else {
        complexPayload.set(Object.keys(DATA_TYPE)[DATA_TYPE.audioClipType], datum.getValue(callingObject));
      }
    }
    return complexPayload;
  }

}