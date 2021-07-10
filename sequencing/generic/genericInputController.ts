
import { _decorator, Component, Node, find } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { InputController } from '../inputController';
import { RootConfig } from '../rootConfig';
import { GenericInputData } from './genericInputData';
const { ccclass, property } = _decorator;

@ccclass('GenericInputController')
export class GenericInputController extends Component implements InputController {

  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }
  
  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  public get masterSequences() {
    return this._rootConfig.masterSequences;
  }
  
  @property({type: [GenericInputData], visible: true})
  private _inputData: GenericInputData[] = [];
  public get inputData() {
    return this._inputData;
  }
  public set inputData(value: GenericInputData[]) {
    this._inputData = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  onDisable () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  configureData() {
    for(let i=0; i<this.rootConfig.masterSequences.length; i++) {
      const masterSequence = this.rootConfig.masterSequences[i];

      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {        
        const inputItem = new GenericInputData();
        inputItem.sequenceController = masterSequence.sequenceControllers[q];
        this.inputData.push(inputItem);
      }
    }
  }


}