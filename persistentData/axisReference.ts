
import { _decorator, Component, Node } from 'cc';
import { GetSceneData } from '../utils';
import { Axis } from './axis';
import { VariableReference } from './variableReference';
const { ccclass, property } = _decorator;

@ccclass('AxisReference')
export class AxisReference extends VariableReference {

  getVariable(callingObject: Node) {
    const sceneData = GetSceneData();
    return sceneData.getValue(callingObject, this.variableReference);
  }
  
  isActive(callingObject: Node) : boolean
  {
    return (this.getVariable(callingObject) as Axis).active;
  }

  setStatus(callingObject: Node, targetValue: boolean)
  {
    const axis = (this.getVariable(callingObject) as Axis);
    axis.setStatus(targetValue);
    return axis;
  }

  setInverted(callingObject: Node, targetValue: boolean)
  {
    const axis = (this.getVariable(callingObject) as Axis);
    axis.setInverted(targetValue);
    return axis;
  }

}
