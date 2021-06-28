
import { _decorator, Component, Node } from 'cc';
import { AxisMonitor } from './axisMonitor';
import { TouchData } from './touchData';
import { TouchExtents } from './touchExtents';
import { AnimationEvent } from '../../utils';
import SequenceController from '../sequenceController';
import { Axis } from '../../persistentData/axis';
import MasterSequence from '../masterSequence';
import { TouchForkExtents } from './touchForkExtents';
const { ccclass, property } = _decorator;

@ccclass('AxisExtents')
export class AxisExtents extends TouchExtents {

  private _swipeAxis: Axis = null!;
  public get swipeAxis() {
    return this._swipeAxis;
  }
  public set swipeAxis(value: Axis) {
    this._swipeAxis = value;
  }

  private _momentumAxis: Axis = null!;
  public get momentumAxis() {
    return this._momentumAxis;
  }
  public set momentumAxis(value: Axis) {
    this._momentumAxis = value;
  }

  private _markerMasterTime: number = 0;
  public get markerMasterTime() {
    return this._markerMasterTime;
  }
  public set markerMasterTime(value: number) {
    this._markerMasterTime = value;
  }


  constructor(axisMonitor: AxisMonitor, touchData: TouchData, marker: AnimationEvent)
  {
    super();
    this.axisMonitor = axisMonitor;
    this.sequence = touchData.sequenceController;
    // this.description = axisMarker.description;

    const targetMasterSequence = axisMonitor.touchController.rootConfig.masterSequences.find(x => x.node === touchData.sequenceController.masterSequenceNode) as MasterSequence;
  
    this.markerMasterTime = MasterSequence.localToMasterTime(targetMasterSequence, touchData.sequenceController, marker.frame);
    
    if (marker.func.indexOf('y') !== -1) {
      this.swipeAxis = axisMonitor.touchController.ySwipeAxis;
      this.momentumAxis = axisMonitor.touchController.yMomentumAxis;
    }
    else if(marker.func.indexOf('x') !== -1) {
      this.swipeAxis = axisMonitor.touchController.xSwipeAxis;
      this.momentumAxis = axisMonitor.touchController.xMomentumAxis;
    }

    if(marker.func.indexOf('-') !== -1) {
      this.inverted = true;
    }
  }

  configure(previousTouchExtents: TouchExtents | null, nextTouchExtents: TouchExtents | null)
  {
    super.configure(previousTouchExtents, nextTouchExtents);
    if (previousTouchExtents != null) {

        this.startTime = previousTouchExtents.endTime;
        this.previousTouchExtents = previousTouchExtents;

        if(previousTouchExtents instanceof AxisExtents) {
          this.startTransitionThreshold =
                        this.markerMasterTime + this.axisMonitor.axisTransitionSpread;
        }
        
        else if(previousTouchExtents instanceof TouchForkExtents) {
          this.startTransitionThreshold = this.startTime + this.axisMonitor.axisTransitionSpread;
        }

    } else {
        this.startTime = this.markerMasterTime;
        this.startTransitionThreshold = this.markerMasterTime;
    }

    if (nextTouchExtents != null) {

        this.nextTouchExtents = nextTouchExtents;

        if(nextTouchExtents instanceof AxisExtents) {
          this.endTime = nextTouchExtents.markerMasterTime;
          this.endTransitionThreshold = nextTouchExtents.markerMasterTime - this.axisMonitor.axisTransitionSpread;
        }

        else if(nextTouchExtents instanceof TouchForkExtents) {
          this.endTime = nextTouchExtents.startTime;
          this.endTransitionThreshold = nextTouchExtents.startTime;
        }

    } else {
        this.endTime = Number.MAX_VALUE;
        this.endTransitionThreshold = Number.MAX_VALUE;
    }

    return this;
}

}