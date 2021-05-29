
import { _decorator, Component, Node } from 'cc';
import { InputController } from '../inputController';
import InputModule from '../inputModule';
import { AutorunController } from './autorunController';
const { ccclass, property } = _decorator;

export default interface AutorunModule extends InputModule {
    autorunController: AutorunController;
    autorunThreshold: number;
    inputController: InputController;
    onSequenceUpdated: Function;
    triggerAutorunIntervalComplete: Function;
    attemptRegisterAutorunModule: Function;
}