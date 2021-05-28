
import { _decorator, Component, Node, find, TextAsset } from 'cc';
import { CONSTANTS } from '../constants';
import AppSettings from './appSettings';
import { BoolVariable } from './boolVariable';
import { IntVariable } from './intVariable';
// import FloatVariable from './floatVariable';
// import IntVariable from './intVariable';
// import StringVariable from './stringVariable';
const { ccclass, property } = _decorator;

@ccclass('SceneData')
export class SceneData extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  // @property({type: [StringVariable], visible: true})
  // private _stringVariable: StringVariable[] = [];

  // public get stringVariable() {
  //   return this._stringVariable;
  // }
  // public set stringVariable(value: StringVariable[]) {
  //   this._stringVariable = value;
  // }

  // @property({type: [FloatVariable], visible: true})
  // private _floatVariable: FloatVariable[] = [];

  // public get floatVariable() {
  //   return this._floatVariable;
  // }
  // public set floatVariable(value: FloatVariable[]) {
  //   this._floatVariable = value;
  // }

  @property({type: [BoolVariable], visible: true})
  private _boolVariables: BoolVariable[] = [];

  private get boolVariables() {
    return this._boolVariables;
  }
  private set boolVariables(value: BoolVariable[]) {
    this._boolVariables = value;
  }

  @property({type: [IntVariable], visible: true})
  private _intVariables: IntVariable[] = [];

  public get intVariables() {
    return this._intVariables;
  }
  public set intVariables(value: IntVariable[]) {
    this._intVariables = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  /// APP SETTINGS ///

  getAppSettingsValue(callingObject: Node, variableKey: TextAsset) {
    return this.appSettings.getValueViaVariableKey(callingObject, variableKey);
  }

  setAppSettingsValue(callingObject: Node, variableKey: TextAsset, targetValue: any) {
    return this.appSettings.setValueViaVariableKey(callingObject, variableKey, targetValue);
  }

  setAppSettingsValueToDefault(callingObject: Node, variableKey: TextAsset) {
    return this.appSettings.setDefaultValueViaVariableKey(callingObject, variableKey);
  }

  /// BOOL ///

  getBoolValue(callingObject: Node, variableKey: TextAsset)  {
    for(let i=0; i<this.boolVariables.length; i++) {
      if(this.boolVariables[i].variableKey === variableKey) {
        return this.boolVariables[i].getValue();
      }
    }
    return this.getAppSettingsValue(callingObject, variableKey);
  }

  setBoolValue(callingObject: Node, variableKey: TextAsset, targetValue: boolean)  {
    console.log("setting bool value");
    for(let i=0; i<this.boolVariables.length; i++) {
      if(this.boolVariables[i].variableKey === variableKey) {
        this.boolVariables[i].setValue(targetValue);
        this.appSettings.triggerSimpleEvent(callingObject, variableKey.name);
      }
    }
    return this.setAppSettingsValue(callingObject, variableKey, targetValue);
  }

  /// INT ///

  getIntValue(callingObject: Node, variableKey: TextAsset)  {
    for(let i=0; i<this.intVariables.length; i++) {
      if(this.intVariables[i].variableKey === variableKey) {
        return this.intVariables[i].getValue();
      }
    }
    return this.getAppSettingsValue(callingObject, variableKey);
  }

  setIntValue(callingObject: Node, variableKey: TextAsset, targetValue: number)  {
    for(let i=0; i<this.intVariables.length; i++) {
      if(this.intVariables[i].variableKey === variableKey) {
        this.intVariables[i].setValue(targetValue);
        this.appSettings.triggerSimpleEvent(callingObject, variableKey.name);
      }
    }
    return this.setAppSettingsValue(callingObject, variableKey, targetValue);
  }

  setIntToDefault(callingObject: Node, variableKey: TextAsset)  {
    for(let i=0; i<this.intVariables.length; i++) {
      if(this.intVariables[i].variableKey === variableKey) {
        this.intVariables[i].setToDefaultValue();
        this.appSettings.triggerSimpleEvent(callingObject, variableKey.name);
      }
    }
    return this.setAppSettingsValueToDefault(callingObject, variableKey);
  }



}
