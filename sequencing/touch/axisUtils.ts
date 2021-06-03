
import { _decorator, Component, Node } from 'cc';
import { AxisExtents } from './axisExtents';
import { TouchExtents } from './touchExtents';
const { ccclass, property } = _decorator;

export class AxisUtils {
    
  static ActivateAxisExtents(masterTime: number, activeExtents: AxisExtents) : TouchExtents
  {
    const axisMonitorObject = activeExtents.axisMonitor.node; 
    
    // Since we are currently within the extents, set the swipe to true
    activeExtents.swipeAxis.setInverted(axisMonitorObject, activeExtents.inverted);
    activeExtents.momentumAxis.setInverted(axisMonitorObject, activeExtents.inverted);
    activeExtents.swipeAxis.setStatus(axisMonitorObject, true);
    activeExtents.momentumAxis.setStatus(axisMonitorObject,  true);
    
    // If we are beyond the transition thresholds, that means this switch
    // is fully active; we can just activate the momentum, deactivate the
    // adjacent extents and avoid further calculation
    if (masterTime > activeExtents.startTransitionThreshold &&
        masterTime < activeExtents.endTransitionThreshold) {

        return AxisUtils.setDefaultState(activeExtents);
    }

    // Check transition thresholds to either activate or deactivate adjacent extents
    if (activeExtents.previousTouchExtents != null) {
            
        if (masterTime <= activeExtents.startTransitionThreshold) {

            if (activeExtents.previousTouchExtents instanceof AxisExtents) {  
              return AxisUtils.setAxisTransitionState(activeExtents, activeExtents.previousTouchExtents);
            }
            
            // else if(case TouchForkExtents previousForkExtents:
            //         return SetForkTransitionState(activeExtents.axisMonitor.touchController, previousForkExtents);) {

            // }
        }
    }

    if (activeExtents.nextTouchExtents != null) {
            
        if (masterTime >= activeExtents.endTransitionThreshold) {

            if (activeExtents.nextTouchExtents instanceof AxisExtents) {
              return AxisUtils.setAxisTransitionState(activeExtents, activeExtents.nextTouchExtents);
            }

            // else if(case TouchForkExtents nextForkExtents:
            //         return SetForkTransitionState(activeExtents.axisMonitor.touchController, nextForkExtents) {

            //         }
        }
    }

    return activeExtents;
  }

  static setDefaultState(activeExtents: AxisExtents) : AxisExtents
  {
      activeExtents.axisMonitor.setTransitionStatus(false);
      const touchController = activeExtents.axisMonitor.touchController;
      const axisMonitorObject = activeExtents.axisMonitor.node;
      
      // Deactivate the opposing swipe axis
      if (activeExtents.swipeAxis == touchController.ySwipeAxis) {
          touchController.xSwipeAxis.setStatus(axisMonitorObject, false);
          
      } else if (activeExtents.swipeAxis == touchController.xSwipeAxis) {
          touchController.ySwipeAxis.setStatus(axisMonitorObject, false);
      }

      if (activeExtents.momentumAxis == touchController.yMomentumAxis) {
          touchController.xMomentumAxis.setStatus(axisMonitorObject, false);
          
      } else if (activeExtents.momentumAxis == touchController.xMomentumAxis) {
          touchController.yMomentumAxis.setStatus(axisMonitorObject, false);
      }

      return activeExtents;
  }

  static setAxisTransitionState(activeExtents: AxisExtents, siblingAxisExtents: AxisExtents) : AxisExtents
  {
      activeExtents.axisMonitor.setTransitionStatus(true);
      const axisMonitorObject = activeExtents.axisMonitor.node;
      
      siblingAxisExtents.swipeAxis.setStatus(axisMonitorObject, true);
      siblingAxisExtents.momentumAxis.setStatus(axisMonitorObject, true);
      siblingAxisExtents.swipeAxis.setInverted(axisMonitorObject, siblingAxisExtents.inverted);
      siblingAxisExtents.momentumAxis.setInverted(axisMonitorObject, siblingAxisExtents.inverted);

      return activeExtents;
  }

}