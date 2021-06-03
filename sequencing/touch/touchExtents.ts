
import { _decorator, Component, Node, CCFloat } from 'cc';
import Extents from '../extents';
import { SequenceController } from '../sequenceController';
import { AxisMonitor } from './axisMonitor';
const { ccclass, property } = _decorator;

@ccclass('TouchExtents')
export class TouchExtents implements Extents {

  @property({visible: true})
  private _description: string = "";
  public get description() {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }

  private _startTime: number = 0;
  public get startTime() {
    return this._startTime;
  }
  public set startTime(value: number) {
    this._startTime = value;
  }

  private _endTime: number = 0;
  public get endTime() {
    return this._endTime;
  }
  public set endTime(value: number) {
    this._endTime = value;
  }

  private _startTransitionThreshold: number = 0;
  public get startTransitionThreshold() {
    return this._startTransitionThreshold;
  }
  public set startTransitionThreshold(value: number) {
    this._startTransitionThreshold = value;
  }

  private _endTransitionThreshold: number = 0;
  public get endTransitionThreshold() {
    return this._endTransitionThreshold;
  }
  public set endTransitionThreshold(value: number) {
    this._endTransitionThreshold = value;
  }

  private _previousTouchExtents: TouchExtents | null = null!;
  public get previousTouchExtents() {
    return this._previousTouchExtents;
  }
  public set previousTouchExtents(value: TouchExtents | null) {
    this._previousTouchExtents = value;
  }

  private _nextTouchExtents: TouchExtents | null = null!;
  public get nextTouchExtents() {
    return this._nextTouchExtents;
  }
  public set nextTouchExtents(value: TouchExtents | null) {
    this._nextTouchExtents = value;
  }

  private _sequence: SequenceController = null!;
  public get sequence() {
    return this._sequence;
  }
  public set sequence(value: SequenceController) {
    this._sequence = value;
  }

  private _axisMonitor: AxisMonitor = null!;
  public get axisMonitor() {
    return this._axisMonitor;
  }
  public set axisMonitor(value: AxisMonitor) {
    this._axisMonitor = value;
  }

  initialize(startTime: number, endTime: number, description: string) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
  }

  createExtentsList() : Extents[] {
    let extents: Extents[] = [];
    return extents;
  }


  static timeWithinExtents(sourceTime: number, extents: TouchExtents[]) : [TouchExtents, boolean]
  {
      // Check if we're inside a pauseMomentumThreshold
      let currentExtents: TouchExtents;

      for (let q = 0; q < extents.length; q++) {
          if(sourceTime >= extents[q].startTime &&
              sourceTime <= extents[q].endTime) {
              currentExtents = extents[q];
              return [currentExtents, true];
          }
      }
      currentExtents = null!;
      return [currentExtents, false];
  }

  // This should be overridden in subclasses
  configure(previousTouchExtents: TouchExtents | null, nextTouchExtents: TouchExtents | null) { }
  
}