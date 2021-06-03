
import { _decorator, Component, Node, TextAsset, find } from 'cc';
import { COMPLEX_EVENT, CONSTANTS, INTERNAL_COMPLEX_EVENT, SIMPLE_EVENT } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { AnimationEvent } from '../../utils';
import MasterSequence from '../masterSequence';
import { AxisExtents } from './axisExtents';
import { AxisUtils } from './axisUtils';
import TouchController from './touchController';
import { TouchData } from './touchData';
import { TouchExtents } from './touchExtents';
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

  private _touchExtentsCollection: TouchExtentsDictionary[] = null!;
  public get touchExtentsCollection() {
    return this._touchExtentsCollection;
  }
  public set touchExtentsCollection(value: TouchExtentsDictionary[]) {
    this._touchExtentsCollection = value;
  }

  @property({type: TouchController, visible: true})
  private _touchController: TouchController = null!;
  public get touchController() {
    return this._touchController;
  }
  public set touchController(value: TouchController) {
    this._touchController = value;
  }

  @property({type: TextAsset, visible: true})
  private _yNorthKey: TextAsset = null!;
  public get yNorthKey() {
    return this._yNorthKey;
  }
  public set yNorthKey(value: TextAsset) {
    this._yNorthKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _ySouthKey: TextAsset = null!;
  public get ySouthKey() {
    return this._ySouthKey;
  }
  public set ySouthKey(value: TextAsset) {
    this._ySouthKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _xEastKey: TextAsset = null!;
  public get xEastKey() {
    return this._xEastKey;
  }
  public set xEastKey(value: TextAsset) {
    this._xEastKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _xWestKey: TextAsset = null!;
  public get xWestKey() {
    return this._xWestKey;
  }
  public set xWestKey(value: TextAsset) {
    this._xWestKey = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TOUCH_CONTROLLER_CONFIGURATION_COMPLETE], this.configureData, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshAxes, this);
  }

  onDisable () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TOUCH_CONTROLLER_CONFIGURATION_COMPLETE], this.configureData, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.refreshAxes, this);
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
        const rawExtents = AxisMonitor.createExtentsList(this, touchData, markers as any);

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
          AxisUtils.ActivateAxisExtents(masterTime, currentExtents);
        }
        
        // else if (currentExtents is TouchForkExtents forkExtents) {
        //     TouchForkUtils.ActivateTouchFork(masterTime, forkExtents);
        // }
          
      }
    }
  }

  static createExtentsList(axisMonitor: AxisMonitor, touchData: TouchData, markers: AnimationEvent[])
  {
      const touchExtentsData: TouchExtents[] = [];
      
      for(let i=0; i<markers.length; i++) {
          switch (markers[i].func) {

            case "y":
            case "x":
            case "-x":
            case "-y":
              touchExtentsData.push(new AxisExtents(axisMonitor, touchData, markers[i]));
          }
      }

      // Joiner.ForkDataCollection forkDataCollection = axisMonitor.touchController.joiner.forkDataCollection;
      
      // if (forkDataCollection.ContainsKey(touchData.sequence) && forkDataCollection[touchData.sequence][0].fork is TouchFork) {
      //     for (int i = 0; i < forkDataCollection[touchData.sequence].Count; i++) {
      //         touchExtentsData.Add(new TouchForkExtents(axisMonitor, touchData, forkDataCollection[touchData.sequence][i]));
      //     }
      // }
      
      // touchExtentsData.Sort(new AxisExtentsSort());
      return touchExtentsData;
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
