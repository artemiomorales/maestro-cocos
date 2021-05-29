
import { _decorator, Component } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import { InputController } from '../inputController';
import { RootConfig } from '../rootConfig';
import { RootDataCollector } from '../rootDataCollector';
import { SequenceController } from '../sequenceController';
import { AutorunData } from './autorunData';
import AutorunExtents from './autorunExtents';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('AutorunController')
export class AutorunController extends Component implements InputController {

  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }
  
  public get appSettingsNode() {
    return this._rootConfig.appSettingsNode;
  }

  public get appSettings() {
    return this._rootConfig.appSettings;
  }

  public get isReversing() {
    return this.appSettings.getIsReversing(this.node);
  }

  public get masterSequences() {
    return this._rootConfig.masterSequences;
  }

  @property({type: [AutorunData], visible: true})
  private _autorunData: AutorunData[] = [];
  public get autorunData() {
    return this._autorunData;
  }
  public set autorunData(value: AutorunData[]) {
    this._autorunData = value;
  }

  @property({visible: true})
  private _pauseMomentumDuringAutorun: boolean = true;
  public get pauseMomentumDuringAutorun() {
    return this._pauseMomentumDuringAutorun;
  }

  start() {
    console.log("autorun is starting");
    this.configureData();
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  onDisable () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  configureData() {
    for(let i=0; i<this.rootConfig.masterSequences.length; i++) {
      const masterSequence = this.rootConfig.masterSequences[i];

      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {
        const sequenceController = masterSequence.sequenceControllers[q];
        const markerConfig = this.GetConfigTimes(sequenceController.animationClip.events as any);
        this.autorunData.push(this.CreateAutorunData(sequenceController, markerConfig[0], markerConfig[1], markerConfig[2], markerConfig[3]))
      }
    }
  }

  GetConfigTimes(eventList: [{
      frame: number;
      func: string;
      params: any[];
  }]) : [number[], number[], string[], number[]]
  {
      const autoplayStarts: number[] = [];
      const autoplayEnds: number[] = [];
      const videoIntervalIds: number[] = [];
      const descriptions: string[] = [];
      const isEndIds: number[] = [];

      let markerId = 0;

      for(let i=0; i<eventList.length; i++) {
          
          const marker = eventList[i];

          if (marker.func == "mplay") {
            autoplayStarts.push(marker.frame);
          }

          else if (marker.func == "mend") {
              autoplayEnds.push(marker.frame);
              isEndIds.push(markerId - 1);
          }

          else if(marker.func == "mpause") {
              autoplayEnds.push(marker.frame);
              autoplayStarts.push(marker.frame);
          }

          // if (marker is IVideoConfigurator videoConfigurator && videoConfigurator.isVideoSequence == true)  {
          //     videoIntervalIds.Add(markerId);
          // }
          
          if (marker.func == "description")  {
              descriptions.push(marker.params[0]);
          }

          markerId++;
      }

      return [autoplayStarts, autoplayEnds, descriptions, isEndIds];
  }

  CreateAutorunData(targetSequence: SequenceController, autoplayStarts: number[], autoplayEnds: number[], descriptions: string[], isEndIds: number[])
  {
      const autorunIntervals: AutorunExtents[] = this.CreateAutorunExtents(autoplayStarts, autoplayEnds, descriptions, isEndIds);
      
      return AutorunData.CreateInstance(targetSequence, autorunIntervals);
  }

  
  CreateAutorunExtents(startTimes: number[], endTimes: number[], descriptions: string[], isEndIds: number[]) : AutorunExtents[]
  {
    let autorunExtents: AutorunExtents[] = [];

    if(startTimes.length != endTimes.length) {
        if(startTimes.length != endTimes.length + 1) {
            throw ("Start time threshold and end time threshold counts do not match.");
        }
    }

    for(let i=0; i<startTimes.length; i++)
    {
        let extents: AutorunExtents;
        
        if(i <= endTimes.length - 1) {
            extents = new AutorunExtents();
            extents.initialize(startTimes[i], endTimes[i], descriptions[i])
        } else {
            extents = new AutorunExtents();
            extents.initialize(startTimes[i], Number.MAX_VALUE, descriptions[i])
        }
        
        // if(videoIntervalIds.Contains(i) == true) {
        //     extents.isVideoSequence = true;
        // }

        if (i in isEndIds)
        {
            extents.isEnd = true;
        }
        
        autorunExtents.push(extents);
    }

    return autorunExtents;
  }

  TriggerPauseMomentum(targetSequence: SequenceController)
  {
      // pauseMomentum.RaiseEvent(this.gameObject, targetSequence);
  }

}