
import { _decorator, Component, Node, CCInteger } from 'cc';
import { RootConfig } from './rootConfig';
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

@ccclass('MasterSequence')
export default class MasterSequence extends Component {

  @property({type: RootConfig, visible: true})
  public _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }

  @property({type: [SequenceController], visible: true})
  private _sequenceControllers: SequenceController[] = [];
  public get sequenceControllers() {
    return this._sequenceControllers;
  }
  public set sequenceControllers(value: SequenceController[]) {
    this._sequenceControllers = value;
  }

  @property({type: ActiveInputModuleData, visible: true})
  private _activeInputModule: ActiveInputModuleData = new ActiveInputModuleData();
  public get activeInputModule() {
    return this._activeInputModule;
  }
  public set activeInputModule(value: ActiveInputModuleData) {
    this._activeInputModule = value;
  }

  init () {
    for (let i = 0; i < this.sequenceControllers.length; i++) {
      this.sequenceControllers[i].init(this);
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

}

