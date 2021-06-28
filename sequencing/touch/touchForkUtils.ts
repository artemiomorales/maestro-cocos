
import { _decorator, TextAsset } from 'cc';
import { AXIS_TYPE, DESTINATION_TYPE, SWIPE_DIRECTION } from '../../constants';
import { AxisExtents } from './axisExtents';
import TouchController from './touchController';
import { TouchExtents } from './touchExtents';
import { TouchForkExtents } from './touchForkExtents';
const { ccclass, property } = _decorator;

@ccclass('TouchForkUtils')
export class TouchForkUtils {

  static activateTouchFork(masterTime: number, touchForkExtents: TouchForkExtents) : TouchExtents
  {
    const touchController = touchForkExtents.axisMonitor.touchController;

    // If we are beyond the transition thresholds, set the adjacent sequence based on swipe input
    if (touchForkExtents.joinType == DESTINATION_TYPE.next && masterTime >= touchForkExtents.startTransitionThreshold ||
        touchForkExtents.joinType == DESTINATION_TYPE.previous && masterTime <= touchForkExtents.startTransitionThreshold) {
        
        return TouchForkUtils.setForkTransitionState(touchController, touchForkExtents);
        
    }

    if (touchForkExtents.joinType == DESTINATION_TYPE.previous && masterTime >= touchForkExtents.endTransitionThreshold) {

        if (touchForkExtents.nextTouchExtents instanceof AxisExtents) {
            return TouchForkUtils.setAxisTransitionState(touchForkExtents.nextTouchExtents); 
        }

    }

    return TouchForkUtils.setDefaultState(touchController, touchForkExtents);
  }

  static setForkTransitionState(touchController: TouchController, touchForkExtents: TouchForkExtents): TouchForkExtents {
      touchController.joiner.setForkStatus(true);
      
      const axisMonitorObject = touchForkExtents.axisMonitor.node;

      touchController.ySwipeAxis.setStatus(axisMonitorObject, true);
      touchController.yMomentumAxis.setStatus(axisMonitorObject, true);
      touchController.xSwipeAxis.setStatus(axisMonitorObject, true);
      touchController.xMomentumAxis.setStatus(axisMonitorObject, true);
          
      switch (touchController.swipeDirection) {
              
          case SWIPE_DIRECTION.yPositive:
              TouchForkUtils.updateBranchStates(AXIS_TYPE.Y, touchForkExtents);
              TouchForkUtils.updateTouchVariables(SWIPE_DIRECTION.yPositive, touchForkExtents);
              TouchForkUtils.resetOpposingBranch(touchForkExtents, touchForkExtents.axisMonitor.ySouthKey);
              if(touchForkExtents.touchForkJoinerDestination.originKey !== touchForkExtents.axisMonitor.ySouthKey) {
                touchForkExtents.touchForkJoinerDestination.setDestinationViaTextAsset(axisMonitorObject, touchForkExtents.axisMonitor.ySouthKey);
              }
              break;
              
          case SWIPE_DIRECTION.yNegative:
              TouchForkUtils.updateBranchStates(AXIS_TYPE.Y, touchForkExtents);
              TouchForkUtils.updateTouchVariables(SWIPE_DIRECTION.yNegative, touchForkExtents);
              TouchForkUtils.resetOpposingBranch(touchForkExtents, touchForkExtents.axisMonitor.yNorthKey);
              if(touchForkExtents.touchForkJoinerDestination.originKey !== touchForkExtents.axisMonitor.yNorthKey) {
                touchForkExtents.touchForkJoinerDestination.setDestinationViaTextAsset(axisMonitorObject, touchForkExtents.axisMonitor.yNorthKey);
              }
              break;
              
          case SWIPE_DIRECTION.xPositive:
              TouchForkUtils.updateBranchStates(AXIS_TYPE.X, touchForkExtents);
              TouchForkUtils.updateTouchVariables(SWIPE_DIRECTION.xPositive, touchForkExtents);
              TouchForkUtils.resetOpposingBranch(touchForkExtents, touchForkExtents.axisMonitor.xEastKey);
              if(touchForkExtents.touchForkJoinerDestination.originKey !== touchForkExtents.axisMonitor.xEastKey) {
                touchForkExtents.touchForkJoinerDestination.setDestinationViaTextAsset(axisMonitorObject, touchForkExtents.axisMonitor.xEastKey);
              }
              
              break;
              
          case SWIPE_DIRECTION.xNegative:
              TouchForkUtils.updateBranchStates(AXIS_TYPE.X, touchForkExtents);
              TouchForkUtils.updateTouchVariables(SWIPE_DIRECTION.xNegative, touchForkExtents);
              TouchForkUtils.resetOpposingBranch(touchForkExtents, touchForkExtents.axisMonitor.xWestKey);
              if(touchForkExtents.touchForkJoinerDestination.originKey !== touchForkExtents.axisMonitor.xWestKey) {
                touchForkExtents.touchForkJoinerDestination.setDestinationViaTextAsset(axisMonitorObject, touchForkExtents.axisMonitor.xWestKey);
              }
              break;
      }

      return touchForkExtents;
  }

  static resetOpposingBranch(touchForkExtents: TouchForkExtents, targetBranchType: TextAsset): TouchForkExtents {

    touchForkExtents.branchDictionaryCollection.forEach(branchingPath => {
      if(branchingPath.branchKey === targetBranchType) {
        touchForkExtents.axisMonitor.touchForkExtents.forEach(x => {
          if(x.sequence === branchingPath.touchBranchingPathData.sequence) {
            x.touchForkJoinerDestination.setDestinationToEmpty(touchForkExtents.axisMonitor.node);
          }
        })
      }
    });

    return touchForkExtents;
  }

  static setAxisTransitionState(axisExtents: AxisExtents): AxisExtents 
  {
      axisExtents.axisMonitor.setTransitionStatus(true);
      
      const axisMonitorObject = axisExtents.axisMonitor.node;
      
      axisExtents.swipeAxis.setStatus(axisMonitorObject, true);
      axisExtents.momentumAxis.setStatus(axisMonitorObject, true);

      return axisExtents;
  }

  static setDefaultState(touchController: TouchController, touchForkExtents: TouchForkExtents) : TouchForkExtents 
  {
      touchController.joiner.setForkStatus(false);
      touchForkExtents.axisMonitor.setTransitionStatus(false);

      const axisMonitorObject = touchForkExtents.axisMonitor.node;

      // Flip axes accordingly
      if (touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.yNorthKey ||
          touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.ySouthKey) {

          touchController.ySwipeAxis.setStatus(axisMonitorObject, true);
          touchController.ySwipeAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
          touchController.yMomentumAxis.setStatus(axisMonitorObject, true);
          touchController.yMomentumAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
          
          touchController.xSwipeAxis.setStatus(axisMonitorObject, false);
          touchController.xMomentumAxis.setStatus(axisMonitorObject, false);

      } else {

          touchController.ySwipeAxis.setStatus(axisMonitorObject, false);
          touchController.yMomentumAxis.setStatus(axisMonitorObject, false);
          
          touchController.xSwipeAxis.setStatus(axisMonitorObject, true);
          touchController.xSwipeAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
          touchController.xMomentumAxis.setStatus(axisMonitorObject, true);
          touchController.xMomentumAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
      }

      return touchForkExtents;
  }

  static updateBranchStates(inputAxisType: number, touchForkExtents: TouchForkExtents): TouchForkExtents
  {
      // Due to the peculiarities of working with a timeline, we need to force
      // the input on opposing branches to move toward the fork so that a user can swipe
      // through the transition smoothly; i.e. if the user is swiping along the Y axis
      // but we are currently on the X branch, we need to make the X branch advance to
      // the transition point regardless of input; also, if either of the Y axes had previously
      // been put into the transition state, they need to be reset. The opposite applies if the user
      // is moving along the X axis.
      if (inputAxisType == AXIS_TYPE.Y) {
          TouchForkUtils.setBranchOverrides(touchForkExtents,
              [touchForkExtents.axisMonitor.xEastKey, touchForkExtents.axisMonitor.xWestKey]);
          TouchForkUtils.resetBranches(touchForkExtents,
              [touchForkExtents.axisMonitor.yNorthKey, touchForkExtents.axisMonitor.ySouthKey]);
      }
      else {
          TouchForkUtils.setBranchOverrides(touchForkExtents,
              [touchForkExtents.axisMonitor.yNorthKey, touchForkExtents.axisMonitor.ySouthKey]);
          TouchForkUtils.resetBranches(touchForkExtents, 
              [touchForkExtents.axisMonitor.xEastKey, touchForkExtents.axisMonitor.xWestKey ]);
      }

      return touchForkExtents;
  }

  static setBranchOverrides(touchForkExtents: TouchForkExtents, targetBranchKeys: TextAsset[]): TouchForkExtents
  {
      for (let q = 0; q < targetBranchKeys.length; q++) {

          if (touchForkExtents.touchForkJoinerDestination.originKey == targetBranchKeys[q]) {
            // Get the placement of the active branch's marker by traversing up to the joiner
            // and filtering via the active branch's sequence and the fork of our active extents
            touchForkExtents.axisMonitor.touchController.touchDataList.find(x => x.sequenceController === touchForkExtents.sequence);
            if (touchForkExtents.joinType == DESTINATION_TYPE.next) {
              touchForkExtents.touchData.forceForward = true;
            }
            else {
              touchForkExtents.touchData.forceBackward = true;
            }
          }
      }

      return touchForkExtents;
  }

  static resetAllBranches(touchForkExtents: TouchForkExtents) : TouchForkExtents
  {
      TouchForkUtils.resetBranches(touchForkExtents, [touchForkExtents.axisMonitor.yNorthKey, touchForkExtents.axisMonitor.ySouthKey, touchForkExtents.axisMonitor.xEastKey, touchForkExtents.axisMonitor.xWestKey ]);

      return touchForkExtents;
  }

  static resetBranches(touchForkExtents: TouchForkExtents, targetBranchTypes: TextAsset[]): TouchForkExtents
  {
      for (let q = 0; q < targetBranchTypes.length; q++) {

        touchForkExtents.branchDictionaryCollection.forEach(branchingPath => {
          if(branchingPath.branchKey === targetBranchTypes[q]) {
            branchingPath.touchBranchingPathData.touchData.forceForward = false;
            branchingPath.touchBranchingPathData.touchData.forceBackward = false;
          }
        })

      }

      return touchForkExtents;
  }

  static updateTouchVariables(swipeDirection: string, touchForkExtents: TouchForkExtents) : TouchForkExtents 
  {
    const touchController = touchForkExtents.axisMonitor.touchController;
    const axisMonitorObject = touchForkExtents.axisMonitor.node;
    
    if (touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.yNorthKey ||
        touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.ySouthKey) {
        touchController.ySwipeAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
        touchController.yMomentumAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);

        TouchController.refreshIsReversing(touchController, swipeDirection, touchController.yMomentumAxis);
    }
    
    else if (touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.xEastKey ||
        touchForkExtents.touchForkJoinerDestination.originKey == touchForkExtents.axisMonitor.xWestKey) {
        touchController.xSwipeAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
        touchController.xMomentumAxis.setInverted(axisMonitorObject, touchForkExtents.inverted);
        
        TouchController.refreshIsReversing(touchController, swipeDirection, touchController.xMomentumAxis);
    }

    return touchForkExtents;
  }
}