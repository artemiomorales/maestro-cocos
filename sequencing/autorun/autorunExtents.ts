
import { _decorator, CCFloat } from 'cc';
import Extents from '../extents';
const { ccclass, property } = _decorator;

@ccclass('AutorunExtents')
export default class AutorunExtents implements Extents {

  @property({visible: true})
  private _description: string = "";
  public get description() {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }

  @property({type: CCFloat, visible: true})
  private _startTime: number = 0;
  public get startTime() {
    return this._startTime;
  }
  public set startTime(value: number) {
    this._startTime = value;
  }

  @property({type: CCFloat, visible: true})
  private _endTime: number = 0;
  public get endTime() {
    return this._endTime;
  }
  public set endTime(value: number) {
    this._endTime = value;
  }

  @property({visible: true})
  private _isEnd: boolean = false;
  public get isEnd() {
    return this._isEnd;
  }
  public set isEnd(value: boolean) {
    this._isEnd = value;
  }

  initialize(startTime: number, endTime: number, description: string) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
  }

  createExtentsList () : Extents[] {
    let extents: Extents[] = [];
    return extents;
  }

  static timeWithinThresholdLowerBoundsInclusiveAscending(sourceTime: number, intervals: AutorunExtents[]) : boolean
  {
      // Check if we're inside a pauseMomentumThreshold
      let withinThreshold = false;

      for (let q = 0; q < intervals.length; q++) {
          if((sourceTime > intervals[q].startTime - .00001 && sourceTime < intervals[q].startTime + .00001) ||
              sourceTime > intervals[q].startTime &&
              sourceTime < intervals[q].endTime) {
              withinThreshold = true;
              break;
          }
      }

      return withinThreshold;
  }
  
  static timeWithinThresholdUpperBoundsInclusiveOut(sourceTime: number, intervals: AutorunExtents[], currentExtents: AutorunExtents) : boolean
  {
      for (let q = 0; q < intervals.length; q++) {
          if(sourceTime > intervals[q].startTime &&
              sourceTime < intervals[q].endTime || 
              (sourceTime > intervals[q].endTime - .00001 && sourceTime < intervals[q].endTime + .00001)) {
              currentExtents = intervals[q];
              return true;
          }
      }
      currentExtents = null!;
      return false;
  }
  
  static timeWithinThresholdLowerBoundsInclusiveAscendingOut(sourceTime: number, intervals: AutorunExtents[], currentExtents: AutorunExtents) : boolean
  {
      for (let q = 0; q < intervals.length; q++) {
          if((sourceTime > intervals[q].startTime - .00001 && sourceTime < intervals[q].startTime + .00001) ||
              sourceTime > intervals[q].startTime &&
              sourceTime < intervals[q].endTime) {
              currentExtents = intervals[q];
              return true;
          }
      }
      currentExtents = null!;
      return false;
  }
  
  static timeWithinThresholdLowerBoundsInclusiveDescending(sourceTime: number, intervals: AutorunExtents[]) : [AutorunExtents, boolean]
  {
      let currentExtents = new AutorunExtents();
      for (let q = intervals.length - 1; q >= 0; q--) {
          if((sourceTime > intervals[q].startTime - .00001 && sourceTime < intervals[q].startTime + .00001) ||
              sourceTime > intervals[q].startTime &&
              sourceTime < intervals[q].endTime) {
              currentExtents = intervals[q];
              return [currentExtents, true];
          }
      }
      currentExtents = null!;
      return [currentExtents, false];
  }
  
  static timeWithinThresholdBothBoundsInclusive(sourceTime: number, intervals: AutorunExtents[]) : [AutorunExtents, boolean]
  {
    let currentExtents = new AutorunExtents();
    for (let q = 0; q < intervals.length; q++) {
        if((sourceTime > intervals[q].startTime - .00001 && sourceTime < intervals[q].startTime + .00001) ||
            sourceTime > intervals[q].startTime &&
            sourceTime < intervals[q].endTime ||
            (sourceTime > intervals[q].endTime - .00001 && sourceTime < intervals[q].endTime + .00001)) {
            currentExtents = intervals[q];
            return [currentExtents, true];
        }
    }
    currentExtents = null!;
    return [currentExtents, false];
  }

  static timeBeyondEndThresholdExclusive(sourceTime: number, interval: AutorunExtents) {
    if(sourceTime > interval.endTime) {
      return true;
    }

    return false;
  }

  static timeBeyondStartThresholdExclusive(sourceTime: number, interval: AutorunExtents) {
    if(sourceTime < interval.startTime) {
      return true;
    }

    return false;
  }

}