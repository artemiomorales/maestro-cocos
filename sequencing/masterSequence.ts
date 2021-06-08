
import { _decorator, Component, Node, CCInteger, find, CCFloat } from 'cc';
import ComplexPayload from '../complexPayload';
import { CONSTANTS, INTERNAL_COMPLEX_EVENT } from '../constants';
import AppSettings from '../persistentData/appSettings';
import SequenceController from './sequenceController';

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

  private _hasActiveSequence: boolean = false;
  public get hasActiveSequence() {
    return this._hasActiveSequence;
  }
  public set hasActiveSequence(value: boolean) {
    this._hasActiveSequence = value;
  }

  private _elapsedTime: number = 0;
  public get elapsedTime() {
    return this._elapsedTime;
  }
  public set elapsedTime(value: number) {
    if(this.masterTimeDataList.length < 1) {
      this.init();
    }
    this._elapsedTime = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshHasActiveSequence, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], this.refreshElapsedTime, this);
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshHasActiveSequence, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], this.refreshElapsedTime, this);
  }

  init () {
    console.log("master sequence initializing");
    // Generate master times for sequences
    this.masterTimeDataList = MasterSequence.generateSequenceData(this.sequenceControllers);

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
  requestActivateForwardAutoplay(targetSequence: SequenceController, requestPriority: number, moduleName: string, targetSpeed: number) : [SequenceController, boolean]
  {
    let requestSuccessful = false;
    
    // if (this.rootConfig.appUtilsRequested == true) {
    //     return targetSequence;
    // }
    
    const sequenceController: SequenceController = this.sequenceControllers.find(x => x === targetSequence) as SequenceController;

    if ((this.activeInputModule.name === "" || !this.activeInputModule) || this.activeInputModule.name == moduleName || requestPriority > this.activeInputModule.priority)
    {
        this.activeInputModule = this.lockInputModule(this, moduleName, requestPriority);
        
        sequenceController.activateForwardAutoplayState(targetSpeed);
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

  /// <summary>
  /// We need to know if the MasterSequence is currently active -
  /// the AxisMonitor uses that data to make sure we're not inadvertently
  /// activating / deactivating playable directors and sequences the user
  /// hasn't reached yet
  /// </summary>
  refreshHasActiveSequence()
  {
    for (let i = 0; i < this.sequenceControllers.length; i++) {
      if (this.sequenceControllers[i].active == true) {
        this.hasActiveSequence = true;
        return;
      }
    }
    this.hasActiveSequence = false;
  }

  /// <summary>
  /// We need to refresh elapsed time whenever a child sequence is modified
  /// in order to make sure the scrubber and other navigation modules
  /// can initialize with the correct time data
  /// </summary>
  /// <param name="modifiedSequence"></param>
  /// <returns></returns>
  refreshElapsedTime(complexPayload: ComplexPayload)
  {
    const modifiedSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME]);
      
    const sequenceTimeData: MasterTimeData = this.masterTimeDataList.find(x => x.sequenceController == modifiedSequence) as MasterTimeData;
    
    if(sequenceTimeData) {
      this.elapsedTime = sequenceTimeData.masterTimeStart + modifiedSequence.currentTime;
    }

    return this;
  }
  
  /// <summary>
  /// The MasterSequence iterates through its child sequences to convert their local
  /// time into global time, as we need global times to ensure scrubbing, bookmarking,
  /// and axis monitoring can operate consistently across timelines.
  /// </summary>
  /// <param name="sourceSequenceControllers"></param>
  /// <returns></returns>
  static generateSequenceData(sourceSequenceControllers: SequenceController[]): MasterTimeData[]
  {
      const sequenceData: MasterTimeData[] = [];
      for (let i = 0; i < sourceSequenceControllers.length; i++)
      {
          let masterTimeStart = 0;
          let masterTimeEnd = 0;

          if (i == 0)  {
              masterTimeEnd = sourceSequenceControllers[i].animationClip.duration;
          } else {
              masterTimeStart = sequenceData[i - 1].masterTimeEnd;
              masterTimeEnd = sourceSequenceControllers[i].animationClip.duration + sequenceData[i - 1].masterTimeEnd;
          }

          const newSequenceData: MasterTimeData = new MasterTimeData();
          newSequenceData.initialize(sourceSequenceControllers[i], masterTimeStart, masterTimeEnd);
          sequenceData.push(newSequenceData);
      }

      return sequenceData;
  }

  /// <summary>
  /// Modules need to be able to convert local sequence time to
  /// global time when configuring themselves so they can create the correct
  /// intervals to use when evaluating user input 
  /// </summary>
  /// <param name="masterSequence"></param>
  /// <param name="sourceSequence"></param>
  /// <param name="localTime"></param>
  /// <returns></returns>
  /// <exception cref="SystemException"></exception>
  static localToMasterTime(masterSequence: MasterSequence, sourceSequence: SequenceController, localTime: number)
  {
    if (masterSequence.masterTimeDataList.length < 1) {
        masterSequence.init();
    }
    const masterTimeData = masterSequence.masterTimeDataList;
    for (let i = 0; i < masterTimeData.length; i++)
    {
        if (masterTimeData[i].sequenceController == sourceSequence)
        {
            return masterTimeData[i].masterTimeStart + localTime;
        }
    }
    
    throw "Source sequence not found in sequence data.";
  }

}
