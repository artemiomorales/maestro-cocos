
import { _decorator, Component, Node } from 'cc';
import InputData from '../inputData';
import SequenceController from '../sequenceController';
import AutorunExtents from './autorunExtents';
import AutorunModule from './autorunModule';
const { ccclass, property } = _decorator;

@ccclass('AutorunData')
export class AutorunData implements InputData {

  @property({type: SequenceController, visible: true})
  private _sequenceController: SequenceController = null!;
  public get sequenceController() {
    return this._sequenceController;
  }
  public set sequenceController(value: SequenceController) {
    this._sequenceController = value;
  }

  @property({type: [AutorunExtents], visible: true})
  private _autorunIntervals: AutorunExtents[] = [];
  public get autorunIntervals() {
    return this._autorunIntervals;
  }
  public set autorunIntervals(value: AutorunExtents[]) {
    this._autorunIntervals = value;
  }

  @property({visible: true})
  private _activeAutorunModule: AutorunModule = null!;
  public get activeAutorunModule() {
    return this._activeAutorunModule;
  }
  public set activeAutorunModule(value: AutorunModule) {
    this._activeAutorunModule = value;
  }

  @property({type: AutorunExtents, visible: true})
  private _activeInterval: AutorunExtents = null!;
  public get activeInterval() {
    return this._activeInterval;
  }
  public set activeInterval(value: AutorunExtents) {
    this._activeInterval = value;
  }

  @property({visible: true})
  private _forwardUpdateActive: boolean = false;
  public get forwardUpdateActive() {
    return this._forwardUpdateActive;
  }
  public set forwardUpdateActive(value: boolean) {
    this._forwardUpdateActive = value;
  }

  @property({visible: true})
  private _backwardUpdateActive: boolean = false;
  public get backwardUpdateActive() {
    return this._backwardUpdateActive;
  }
  public set backwardUpdateActive(value: boolean) {
    this._backwardUpdateActive = value;
  }
  @property({visible: true})
  private _eligibleForAutoplay: boolean = false;
  public get eligibleForAutoplay() {
    return this._eligibleForAutoplay;
  }
  public set eligibleForAutoplay(value: boolean) {
    this._eligibleForAutoplay = value;
  }

  public static CreateInstance (sequence: SequenceController, autorunIntervals: AutorunExtents[]) : AutorunData {
    let inputData = new AutorunData();
    inputData.sequenceController = sequence;
    inputData.autorunIntervals = autorunIntervals;
    return inputData;
  }
}
