
import { _decorator, Component, Node, TextAsset } from 'cc';
import { DESTINATION_TYPE, INVERT_STATUS } from '../../constants';
import MasterSequence from '../masterSequence';
import { TouchForkJoinerDestination } from '../touchForkJoinerDestination';
import { AxisExtents } from './axisExtents';
import { AxisMonitor } from './axisMonitor';
import { TouchBranchingPathData } from './touchBranchingPathData';
import { TouchData } from './touchData';
import { TouchExtents } from './touchExtents';
const { ccclass, property } = _decorator;

@ccclass('TouchBranchDictionary')
class TouchBranchDictionary {
  
  private _branchKey: TextAsset = null!;
  public get branchKey() {
    return this._branchKey;
  }
  public set branchKey(value: TextAsset) {
    this._branchKey = value;
  }

  private _touchBranchingPathData: TouchBranchingPathData = null!;
  public get touchBranchingPathData() {
    return this._touchBranchingPathData;
  }
  public set touchBranchingPathData(value: TouchBranchingPathData) {
    this._touchBranchingPathData = value;
  }

  constructor(branchKey: TextAsset, touchBranchingPathData: TouchBranchingPathData) {
    this.branchKey = branchKey;
    this.touchBranchingPathData = touchBranchingPathData;
  }

}


@ccclass('TouchForkExtents')
export class TouchForkExtents extends TouchExtents {

  private _branchDictionaryCollection: TouchBranchDictionary[] = [];
  public get branchDictionaryCollection() {
    return this._branchDictionaryCollection;
  }
  public set branchDictionaryCollection(value: TouchBranchDictionary[]) {
    this._branchDictionaryCollection = value;
  }

  private _touchForkJoinerDestination: TouchForkJoinerDestination = null!;
  public get touchForkJoinerDestination() {
    return this._touchForkJoinerDestination;
  }
  public set touchForkJoinerDestination(value: TouchForkJoinerDestination) {
    this._touchForkJoinerDestination = value;
  }
  
  private _joinType: DESTINATION_TYPE = null!;
  public get joinType() {
    return this._joinType;
  }
  public set joinType(value: DESTINATION_TYPE) {
    this._joinType = value;
  }

  private _touchData: TouchData = null!;
  public get touchData() {
    return this._touchData;
  }
  public set touchData(value: TouchData) {
    this._touchData = value;
  }

  constructor(axisMonitor: AxisMonitor, touchData: TouchData, joinType: DESTINATION_TYPE, touchForkJoinerDestination: TouchForkJoinerDestination)
  {
    super();
    this.axisMonitor = axisMonitor;
    this.touchData = touchData;
    this.sequence = touchData.sequenceController;
    this.joinType = joinType;
    // this.description = forkData.description;

    const forkTransitionSpread = axisMonitor.forkTransitionSpread;
    
    if (this.joinType == DESTINATION_TYPE.next) {
        const localStartTime = this.sequence.duration - forkTransitionSpread;

        const targetMasterSequence = axisMonitor.touchController.rootConfig.masterSequences.find(x => x.node === touchData.sequenceController.masterSequenceNode) as MasterSequence;

        this.startTransitionThreshold =
            MasterSequence.localToMasterTime(targetMasterSequence, this.sequence,
                localStartTime);
        this.startTime = this.startTransitionThreshold;
        this.endTransitionThreshold = MasterSequence.localToMasterTime(targetMasterSequence, this.sequence,
            this.sequence.duration);
        this.endTime = this.endTransitionThreshold;
    }
    else {
        this.startTime = 0;
        this.startTransitionThreshold =
            this.startTime + forkTransitionSpread;
    }
    
    this.touchForkJoinerDestination = touchForkJoinerDestination; 

    const originKey = this.touchForkJoinerDestination.originKey;
    if(this.joinType === DESTINATION_TYPE.next &&
      (originKey === axisMonitor.ySouthKey || originKey === axisMonitor.xEastKey)) {
        this.inverted = true;
    }
    if(this.joinType === DESTINATION_TYPE.previous &&
      (originKey === axisMonitor.yNorthKey || originKey === axisMonitor.xWestKey)) {
        this.inverted = true;
    }
    
        
    for (let i = 0; i < touchForkJoinerDestination.branchingPaths.length; i++)
    {
      const branchTouchData = this.axisMonitor.touchController.touchDataList.find(x => x.sequenceController === touchForkJoinerDestination.branchingPaths[i].sequence) as TouchData;
      const branchingPathData = new TouchBranchingPathData(touchForkJoinerDestination.branchingPaths[i], branchTouchData);
      this.branchDictionaryCollection.push(new TouchBranchDictionary(touchForkJoinerDestination.branchingPaths[i].branchKey, branchingPathData));
    }

  }

  configure(previousTouchExtents: TouchExtents, nextTouchExtents: TouchExtents) : TouchExtents
  {
      this.previousTouchExtents = previousTouchExtents;
      this.nextTouchExtents = nextTouchExtents;
      
      if (this.joinType == DESTINATION_TYPE.next) {
          return this;
      }

      if (nextTouchExtents == null) {
          this.endTransitionThreshold = Number.MAX_VALUE;
          this.endTime = Number.MAX_VALUE;
      } else if (nextTouchExtents instanceof AxisExtents) {
          this.endTransitionThreshold = nextTouchExtents.markerMasterTime - this.axisMonitor.axisTransitionSpread;
          this.endTime = nextTouchExtents.markerMasterTime;
      } else if (nextTouchExtents instanceof TouchForkExtents) {
          this.endTransitionThreshold = nextTouchExtents.startTime;
          this.endTime = nextTouchExtents.startTime;
      }

      return this;
  }

}
