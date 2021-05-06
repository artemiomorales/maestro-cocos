
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export default interface Extents {
  description: string;  
  startTime: number;
  endTime: number;
  createExtentsList: Function;
}