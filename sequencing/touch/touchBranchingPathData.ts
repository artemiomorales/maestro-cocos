
import { _decorator, Component, Node } from 'cc';
import { INVERT_STATUS } from '../../constants';
import { BranchingPath } from '../branchingPath';
import { AxisMonitor } from './axisMonitor';
import { TouchData } from './touchData';
const { ccclass, property } = _decorator;

@ccclass('TouchBranchingPathData')
export class TouchBranchingPathData extends BranchingPath {

  private _touchData: TouchData = null!;
  public get touchData() {
    return this._touchData;
  }
  public set touchData(value: TouchData) {
    this._touchData = value;
  }
  
  constructor(branchingPath: BranchingPath, touchData: TouchData)
  {
      super(branchingPath.branchKey, branchingPath.sequence, branchingPath.activationType);
      this.touchData = touchData;
      // this.touchData = axisMonitor.touchController.touchDataList.find(matchedTouchData => matchedTouchData.sequenceController === branchingPath.sequence) as TouchData;
      if (this.touchData == null) {
          throw ("Sequence for branching path not found on Touch Controller. Please make sure all paths of a fork use the same root config.");
      }
  }

}