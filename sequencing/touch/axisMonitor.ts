
import { _decorator, Component, Node, TextAsset, find } from 'cc';
import { COMPLEX_EVENT, CONSTANTS, INTERNAL_COMPLEX_EVENT, DESTINATION_TYPE, SIMPLE_EVENT, INVERT_STATUS } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { AnimationEvent } from '../../utils';
import { SequenceJoinerDictionary } from '../joiner';
import MasterSequence from '../masterSequence';
import { DestinationConfig, JoinConfig } from '../sequenceController';
import { TouchForkJoinerDestination } from '../touchForkJoinerDestination';
import { AxisExtents } from './axisExtents';
import { AxisUtils } from './axisUtils';
import TouchController from './touchController';
import { TouchData } from './touchData';
import { TouchExtents } from './touchExtents';
import { TouchForkExtents } from './touchForkExtents';
import { TouchForkUtils } from './touchForkUtils';
const { ccclass, property, executionOrder } = _decorator;


interface TouchExtentsDictionary {
  masterSequence: MasterSequence;
  touchExtents: TouchExtents[];
}

@ccclass('AxisMonitor')
@executionOrder(5)
export class AxisMonitor extends Component {

  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  @property({visible: true})
  private _moduleActive: boolean = false;
  public get moduleActive() {
    return this._moduleActive;
  }
  public set moduleActive(value: boolean) {
    this._moduleActive = value;
  }

  public get nodeElement() {
    return this.node;
  }

  public get axisTransitionActive() {
    return this.appSettings.getAxisTransitionActive(this.node);
  }

  public set axisTransitionActive(value: boolean) {
    this.appSettings.setAxisTransitionActive(this.node, value);
  }

  public get axisTransitionSpread() {
    return this.appSettings.getAxisTransitionSpread(this.node);
  }

  public get forkTransitionSpread() {
    return this.appSettings.getForkTransitionSpread(this.node);
  }

  private _touchExtentsCollection: TouchExtentsDictionary[] = null!;
  public get touchExtentsCollection() {
    return this._touchExtentsCollection;
  }
  public set touchExtentsCollection(value: TouchExtentsDictionary[]) {
    this._touchExtentsCollection = value;
  }

  private _touchForkExtents: TouchForkExtents[] = [];
  public get touchForkExtents() {
    return this._touchForkExtents;
  }
  public set touchForkExtents(value: TouchForkExtents[]) {
    this._touchForkExtents = value;
  }

  @property({type: TouchController, visible: true})
  private _touchController: TouchController = null!;
  public get touchController() {
    return this._touchController;
  }
  public set touchController(value: TouchController) {
    this._touchController = value;
  }

  public get joiner() {
    return this.touchController.joiner;
  }

  public get yNorthKey() {
    return this.appSettings.getYNorthBranchKey(this.node);
  }

  public get ySouthKey() {
    return this.appSettings.getYSouthBranchKey(this.node);
  }

  public get xWestKey() {
    return this.appSettings.getXWestBranchKey(this.node);
  }

  public get xEastKey() {
    return this.appSettings.getXEastBranchKey(this.node);
  }

  public get touchBranchKeys() {
    return this.appSettings.getTouchBranchKeys(this.node);
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TOUCH_CONTROLLER_CONFIGURATION_COMPLETE], this.configureData, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshAxes, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_ACTIVATED], this.refreshAxes, this);

    this.touchBranchKeys.push(this.yNorthKey);
    this.touchBranchKeys.push(this.ySouthKey);
    this.touchBranchKeys.push(this.xEastKey);
    this.touchBranchKeys.push(this.xWestKey);
  }

  onDisable () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TOUCH_CONTROLLER_CONFIGURATION_COMPLETE], this.configureData, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshAxes, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_ACTIVATED], this.refreshAxes, this);
  }

  setTransitionStatus(targetStatus: boolean)
  {
    this.axisTransitionActive = targetStatus;
  }

  configureData()
  {
    this.touchExtentsCollection = [];

    for (let i = 0; i < this.touchController.touchDataList.length; i++)
    {
        var touchData = this.touchController.touchDataList[i];
        
        const markers = touchData.sequenceController.animationClip.events;
        const rawExtents = AxisMonitor.createExtentsList(this, this.touchController.touchDataList[i], markers as any);

        const targetMasterSequence: MasterSequence = this.touchController.rootConfig.masterSequences.find(x => x.node === touchData.sequenceController.masterSequenceNode) as MasterSequence;
        
        const touchExtentsIndex = this.touchExtentsCollection.findIndex(x => x.masterSequence === targetMasterSequence);

        if (touchExtentsIndex === -1) {
          const touchExtentsDictionary: TouchExtentsDictionary = {} as TouchExtentsDictionary;
          touchExtentsDictionary.masterSequence = targetMasterSequence;
          touchExtentsDictionary.touchExtents = rawExtents as TouchExtents[];
          this.touchExtentsCollection.push(touchExtentsDictionary);
        } else {
          this.touchExtentsCollection[touchExtentsIndex].touchExtents = this.touchExtentsCollection[touchExtentsIndex].touchExtents.concat(rawExtents as TouchExtents[]);
        }
    }

    for( let i=0; i<this.touchExtentsCollection.length; i++) {
      AxisMonitor.configureTouchExtents(this.touchExtentsCollection[i].touchExtents);
    }
  }

  refreshAxes()
  {
    // if (Application.isPlaying == false) return;
    
    if (this.moduleActive == false) {
        return;
    }
    
    for(let i=0; i<this.touchExtentsCollection.length; i++) {
      const touchExtentsDictionary = this.touchExtentsCollection[i];


      if (touchExtentsDictionary.masterSequence.hasActiveSequence == false) continue;
      
      const masterTime = touchExtentsDictionary.masterSequence.elapsedTime;
      const [currentExtents, withinThreshold] = TouchExtents.timeWithinExtents(masterTime, touchExtentsDictionary.touchExtents);

      if (withinThreshold) {

        if (currentExtents instanceof AxisExtents ) {
          AxisUtils.activateAxisExtents(masterTime, currentExtents);
        }
        
        else if (currentExtents instanceof TouchForkExtents) {
          TouchForkUtils.activateTouchFork(masterTime, currentExtents);
        }
          
      }
    }
  }

  // sequenceHasTouchBranchKey(joinConfig: JoinConfig) {
  //   for(let i=0; i<this.touchBranchKeys.length; i++) {
  //     if(this.touchBranchKeys[i] === joinConfig.branchKey) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  static createExtentsList(axisMonitor: AxisMonitor, touchData: TouchData, markers: AnimationEvent[])
  {
    const touchExtentsData: TouchExtents[] = [];
    const touchForkExtentsData: TouchForkExtents[] = [];
    const joiner = axisMonitor.joiner;

    const sequenceJoinerDictionary = joiner.joinerDataCollection.find(x => x.sequence === touchData.sequenceController) as SequenceJoinerDictionary;

    const previousDestinationConfig = sequenceJoinerDictionary.joinerData.previousDestination;
    if(previousDestinationConfig instanceof TouchForkJoinerDestination) {

      if(previousDestinationConfig.branchingPaths.length > 1) {
        const touchForkExtents = new TouchForkExtents(axisMonitor, touchData, DESTINATION_TYPE.previous, previousDestinationConfig);
        touchExtentsData.push(touchForkExtents);
        axisMonitor.touchForkExtents.push(touchForkExtents);
      }

    }
    
    for(let i=0; i<markers.length; i++) {
        switch (markers[i].func) {
          case "y":
          case "x":
          case "-x":
          case "-y":
            touchExtentsData.push(new AxisExtents(axisMonitor, touchData, markers[i]));
        }
    }

    const nextDestinationConfig = sequenceJoinerDictionary.joinerData.nextDestination;
    if(nextDestinationConfig instanceof TouchForkJoinerDestination) {

      if(nextDestinationConfig.branchingPaths.length > 1) {
        touchExtentsData.push(new TouchForkExtents(axisMonitor, touchData, DESTINATION_TYPE.next, nextDestinationConfig));
      }

    }

    // Joiner.ForkDataCollection forkDataCollection = axisMonitor.touchController.joiner.forkDataCollection;
    
    // if (forkDataCollection.ContainsKey(touchData.sequence) && forkDataCollection[touchData.sequence][0].fork is TouchFork) {
    //     for (int i = 0; i < forkDataCollection[touchData.sequence].Count; i++) {
    //         touchExtentsData.Add(new TouchForkExtents(axisMonitor, touchData, forkDataCollection[touchData.sequence][i]));
    //     }
    // }
    
    touchExtentsData.sort(AxisMonitor.axisExtentsSort);
    return touchExtentsData;
  }

  static axisExtentsSort(x: TouchExtents, y: TouchExtents) {

    if(x instanceof AxisExtents && y instanceof AxisExtents) {
      return x.markerMasterTime < y.markerMasterTime ? -1 : 1;
    } else if (x instanceof AxisExtents && y instanceof TouchForkExtents) {
      return x.markerMasterTime < y.startTime ? -1 : 1;
    } else if (x instanceof TouchForkExtents && y instanceof AxisExtents) {
      return x.startTime < y.markerMasterTime ? -1 : 1;
    } else if (x instanceof TouchForkExtents && y instanceof TouchForkExtents) {
      return x.startTime < y.startTime ? -1 : 1;
    }

    throw "Unable to sort axis extents";
  }

  // Whereas we can populate Fork Extents with all of their data upon creation, we need to
  // know the order of Axis Extents first to set up the transitions correctly.
  // Given an ordered list, we then populate the adjacent extents, which allow us
  // to define start times, end times, and transition times between the axis intervals 
  static configureTouchExtents(touchExtentsData: TouchExtents[])
  {
    for (let j = 0; j < touchExtentsData.length; j++) {
      const touchExtents = touchExtentsData[j];   
      if (touchExtentsData.length == 1) {
          touchExtents.configure(null, null);
          break;
      }
          
      if (j == 0) {
          touchExtents.configure(null, touchExtentsData[j + 1]);
      }
      else if (j == touchExtentsData.length - 1)  {
          touchExtents.configure(touchExtentsData[j - 1], null);
      }
      else {
          touchExtents.configure( touchExtentsData[j - 1],  touchExtentsData[j + 1]);
      }       
    }

    return touchExtentsData;
  }

}
