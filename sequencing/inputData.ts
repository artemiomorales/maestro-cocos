
import { _decorator, Component, Node } from 'cc';
import SequenceController from './sequenceController';
const { ccclass, property } = _decorator;

export default interface InputData {
  sequenceController: SequenceController;
}
