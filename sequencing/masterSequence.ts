
import { _decorator, Component, Node, CCInteger, find, CCFloat } from 'cc';
import { CONSTANTS } from '../constants';
import AppSettings from '../persistentData/appSettings';
import { SequenceController } from './sequenceController';

const { ccclass, property } = _decorator;

@ccclass('ActiveInputModuleData')
class ActiveInputModuleData {

  @property({visible: true})
  private _name: string = "";
  public get name() {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  @property({type: CCInteger, visible: true})
  private _priority: number = 0;
  public get priority() {
    return this._priority;
  }
  public set priority(value: number) {
    this._priority = value;
  }

}

@ccclass('MasterTimeData')
class MasterTimeData
{
  @property({visible: true})
  private _sequenceController: SequenceController = null!;
  public get sequenceController() {
    return this._sequenceController;
  }
  public set sequenceController(value: SequenceController) {
    this._sequenceController = value;
  }
  
  @property({type: CCFloat, visible: true})
  private _masterTimeStart: number = 0;
  public get masterTimeStart() {
    return this._masterTimeStart;
  }
  public set masterTimeStart(value: number) {
    this._masterTimeStart = value;
  }

  @property({type: CCFloat, visible: true})
  private _masterTimeEnd: number = 0;
  public get masterTimeEnd() {
    return this._masterTimeEnd;
  }
  public set masterTimeEnd(value: number) {
    this._masterTimeEnd = value;
  }

  initialize(sourceSequence: SequenceController, masterTimeStart: number, masterTimeEnd: number)
  {
      this.sequenceController = sourceSequence;
      this.masterTimeStart = masterTimeStart;
      this.masterTimeEnd = masterTimeEnd;
  }
}

@ccclass('MasterSequence')
export default class MasterSequence extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: [SequenceController], visible: true})
  private _sequenceControllers: SequenceController[] = [];
  public get sequenceControllers() {
    return this._sequenceControllers;
  }
  public set sequenceControllers(value: SequenceController[]) {
    this._sequenceControllers = value;
  }

  @property({type: [MasterTimeData], visible: true})
  private _masterTimeDataList: MasterTimeData[] = [];
  public get masterTimeDataList() {
    return this._masterTimeDataList;
  }
  public set masterTimeDataList(value: MasterTimeData[]) {
    this._masterTimeDataList = value;
  }

  @property({type: ActiveInputModuleData, visible: true})
  private _activeInputModule: ActiveInputModuleData = new ActiveInputModuleData();
  public get activeInputModule() {
    return this._activeInputModule;
  }
  public set activeInputModule(value: ActiveInputModuleData) {
    this._activeInputModule = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  init () {
    for (let i = 0; i < this.sequenceControllers.length; i++) {
      this.sequenceControllers[i].init();
    }   
  }

  /// <summary>
  /// Simple modification requests will simply send details to update the sequence,
  /// then update that sequence manually every frame. 
  /// </summary>
  /// <param name="targetSequence"></param>
  /// <param name="requestPriority"></param>
  /// <param name="moduleName"></param>
  /// <param name="timeModifier"></param>
  /// <returns></returns>
  requestModifySequenceTime(targetSequence: SequenceController, requestPriority: number, moduleName: string, timeModifier: number)
  {

    if (this.activeInputModule.name === "" || this.activeInputModule.name == moduleName || requestPriority > this.activeInputModule.priority)
    {
      this.activeInputModule = this.lockInputModule(this, moduleName, requestPriority);
      targetSequence.modifySequenceTime(timeModifier);
    }

    return targetSequence;
  }

  /// <summary>
  /// We want certain modules to take precedence over others. For example,
  /// the minute a swipe is initiated, we want the swipe to take priority no matter what;
  /// and for autoplaying, we want autoplayers to override momentum the moment an autoplay
  /// interval is reached. 
  /// </summary>
  /// <param name="activeInputModule"></param>
  /// <param name="moduleName"></param>
  /// <param name="priority"></param>
  /// <returns></returns>
  lockInputModule(masterSequence: MasterSequence, moduleName: string, priority: number)
  {
      masterSequence.activeInputModule.name = moduleName;
      masterSequence.activeInputModule.priority = priority;

      return masterSequence.activeInputModule;
  }

  /// <summary>
  /// Note: Not every module should unlock itself when completed. For example,
  /// to prevent momentum from taking over the moment an autorun interval is complete,
  /// we leave the autorun modules locked until a swipe or other high-priority module
  /// takes over.
  /// </summary>
  /// <param name="inputModuleObject"></param>
  unlockInputModule(inputModuleObject: Node)
  {
    if (this.activeInputModule.name == inputModuleObject.name) {
      this.activeInputModule.name = "";
      this.activeInputModule.priority = 0;
    }
  }

  unlockActiveInputModule(inputModuleObject: Node)
  {
    this.activeInputModule.name = "";
    this.activeInputModule.priority = 0;
  }

  /// <summary>
  /// Autoplay modules will want to activate autoplay once, and then cache the interval in which
  /// it was activated so it can halt when the end of that interval is reached.
  /// </summary>
  /// <param name="targetSequence"></param>
  /// <param name="requestPriority"></param>
  /// <param name="moduleName"></param>
  /// <param name="targetSpeed"></param>
  /// <param name="requestSuccessful"></param>
  /// <returns></returns>
  RequestActivateForwardAutoplay(targetSequence: SequenceController, requestPriority: number, moduleName: string, targetSpeed: number) : [SequenceController, boolean]
  {
      let requestSuccessful = false;
      
      // if (this.rootConfig.appUtilsRequested == true) {
      //     return targetSequence;
      // }
      
      const sequenceController: SequenceController = this.sequenceControllers.find(x => x === targetSequence) as SequenceController;

      if ((this.activeInputModule.name === "" || !this.activeInputModule) || this.activeInputModule.name == moduleName || requestPriority > this.activeInputModule.priority)
      {
          this.activeInputModule = this.lockInputModule(this, moduleName, requestPriority);
          
          sequenceController.ActivateForwardAutoplayState(targetSpeed);
          requestSuccessful = true;
      }

      return [targetSequence, requestSuccessful];
  }

  /// <summary>
  /// Once the end of an autoplay interval is reached,
  /// we'll want to revert to manual update status.
  /// </summary>
  /// <param name="targetSequence"></param>
  /// <param name="requestPriority"></param>
  /// <param name="moduleName"></param>
  requestDeactivateForwardAutoplay(targetSequence: SequenceController, requestPriority: number, moduleName: string)
  {
      // if (this.rootConfig.appUtilsRequested == true) {
      //     return;
      // }

      console.log("deactivated");
      
      const sequenceController: SequenceController = this.sequenceControllers.find(x => x === targetSequence) as SequenceController;

      if (this.activeInputModule.name === "" || this.activeInputModule.name == moduleName || requestPriority > this.activeInputModule.priority)
      {
          sequenceController.activateManualUpdateState();
      }
  }

  triggerSequenceBoundaryReached(modifiedSequence: SequenceController) : MasterSequence
  {
      const sequenceTimeData: MasterTimeData | undefined = this.masterTimeDataList.find(x => x.sequenceController == modifiedSequence);

      if (sequenceTimeData) {
          // _sequenceBoundaryReached.Invoke(this.node, modifiedSequence);
      }

      return this;
  }

}
