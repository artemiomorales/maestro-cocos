
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface ISimpleSignalListener {
  onEventRaised: Function;
}