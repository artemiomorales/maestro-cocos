import { _decorator, Component, AnimationComponent, Node, AnimationState, AnimationClip, CCFloat, find, Enum } from 'cc';

import AppSettings from '../persistentData/appSettings';

import { COMPLEX_EVENT, CONSTANTS, INTERNAL_COMPLEX_EVENT } from '../constants';
import ComplexPayload from '../complexPayload';
import { JoinerDestination } from './joinerDestination';

const { ccclass, property } = _decorator;

var SEQUENCE_UPDATE_STATE = Enum({
  FORWARD_AUTOPLAY: -1,
  MANUAL_UPDATE: -1
})

@ccclass('SequenceController')
export class SequenceController extends Component {
    
  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({visible: true})
  private _active = true;
  public get active() {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  @property({visible: true})
  private _loop = false;
  public get loop() {
    return this._loop;
  }
  public set loop(value: boolean) {
    this._loop = value;
  }

  @property({type: Node, visible: true})
  private _masterSequenceNode: Node = null!;
  public get masterSequenceNode() {
    return this._masterSequenceNode;
  }
  public set masterSequenceNode(value: Node) {
    this._masterSequenceNode = value;
  }

  @property({type: CCFloat, visible: true})
  private _currentTime: number = 0;
  public get currentTime() {
    return this._currentTime;
  }
  public set currentTime(value: number) {
    this._currentTime = value;
  }

  @property({type: CCFloat, visible: true})
  private _currentSpeed: number = 0;
  public get currentSpeed() {
    return this._currentSpeed;
  }
  public set currentSpeed(value: number) {
    this._currentSpeed = value;
  }

  @property({type: CCFloat, visible: true})
  private _duration: number = 0;
  public get duration() {
    return this._duration;
  }
  public set duration(value: number) {
    this._duration = value;
  }

  @property({type: AnimationClip, visible: true})
  private _animationClip: AnimationClip = null!;
  public get animationClip() {
    return this._animationClip;
  }
  public set animationClip(value: AnimationClip) {
    this._animationClip = value;
  }

  public _animationComponent: AnimationComponent = null!;
  public get animationComponent() {
    return this._animationComponent;
  }
  public set animationComponent(value: AnimationComponent) {
    this._animationComponent = value;
  }

  @property({type:[JoinerDestination], visible: true})
  public _previousDestination: JoinerDestination[] = [];
  public get previousDestination() {
    return this._previousDestination;
  }
  public set previousDestination(value: JoinerDestination[]) {
    this._previousDestination = value;
  }

  @property({type:[JoinerDestination], visible: true})
  public _nextDestination: JoinerDestination[] = [];
  public get nextDestination() {
    return this._nextDestination;
  }
  public set nextDestination(value: JoinerDestination[]) {
    this._nextDestination = value;
  }

  @property({type: SEQUENCE_UPDATE_STATE, visible: true})
  private _sequenceUpdateState: string = null!;

  public get sequenceUpdateState() {
    return this._sequenceUpdateState;
  }
  public set sequenceUpdateState(value: string) {
    this._sequenceUpdateState = value;
  }

  private _animState: AnimationState = null!;
  public get animState() {
    return this._animState;
  }
  public set animState(value: AnimationState) {
    this._animState = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.animationComponent = this.getComponent(AnimationComponent) as AnimationComponent;

    if(this.animationComponent.defaultClip !== null) {
      this.animationClip = this.animationComponent.defaultClip;
      this.animationComponent.play(this.animationClip.name);
      this.animState = this.animationComponent.getState(this.animationClip.name);
      this.animState.speed = 0;
      
      this.duration = this.animState.duration;
    }

  }

  init() {
    
  }

  /// Activate() and Deactivate() exist so that we can change
  /// the sequence controller's status via Cocos editor event handlers
  activate() {
    this.active = true;
    if(this.loop) {
      this.activateLoop();
    }
  }
  deactivate() {
    this.active = false;
    this.deactivateLoop();
    this.setToBeginning();
    const complexPayload = new ComplexPayload();
    complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_DEACTIVATED], this);
    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_DEACTIVATED], complexPayload)
  }

  activateLoop() {
    this.animState.wrapMode = 1;
    this.animState.time = this.currentTime;
  }
  deactivateLoop() {
    this.animState.wrapMode = 0;
    this.animState.time = this.currentTime;
  }

  lateUpdate() {
    if(this.sequenceUpdateState == Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.FORWARD_AUTOPLAY]) {
      this.currentTime = this.animState.time;
      if(this.currentTime >= this.duration) {
        this.setEndBoundaryReached(this.node);
      } else {
        const complexPayload = new ComplexPayload();
        complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this);
        this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], complexPayload)
      }
    }
  }

  modifySequenceTime(timeModifier: number) {

    const newTime = this.currentTime + timeModifier;

    if(newTime < 0) {
      this.setStartBoundaryReached(this.node);
    }

    else if(newTime > this.duration) {
      this.setEndBoundaryReached(this.node);
    }

    else {
      this.setSequenceTime(this.node, newTime);
    }

  }

  setStartBoundaryReached(caller: Node)
  {
    this.setSequenceTimeWithoutCallbacks(this.node, 0);

    const boundaryReachedPayload = new ComplexPayload();
    boundaryReachedPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], this);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], boundaryReachedPayload);

    const activatePreviousSequencePayload = new ComplexPayload();
    activatePreviousSequencePayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], this);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], activatePreviousSequencePayload);

    // this.masterSequence.TriggerSequenceBoundaryReached(sequence);
    // this.masterSequence.rootConfig.joiner.ActivatePreviousSequence(sequence);
    return this;
  }

  setEndBoundaryReached(caller: Node)
  {
    this.setSequenceTimeWithoutCallbacks(this.node, this.duration);

    const boundaryReachedPayload = new ComplexPayload();
    boundaryReachedPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], this);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], boundaryReachedPayload);

    const activateNextSequencePayload = new ComplexPayload();
    activateNextSequencePayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], this);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], activateNextSequencePayload);

    // this.masterSequence.TriggerSequenceBoundaryReached(sequence);
    // this.masterSequence.rootConfig.joiner.ActivateNextSequence(sequence);
    return this;
  }

  setSequenceTime(caller: Node, targetTime: number)
  {
      // if (sequence.paused == true) return sequence;
      
      this.activateManualUpdateState();
      
      this.currentTime = targetTime;
      this.animState.play();
      this.animState.time = this.currentTime;

      const complexPayload = new ComplexPayload();
      complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this);

      this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], complexPayload)
      // sequence.sequenceController.masterSequence.RefreshElapsedTime(sequence);

      return this;
  }

  setSequenceTimeWithoutCallbacks(caller: Node, targetTime: number)
  {
      // if (sequence.paused == true) return sequence;
      
      this.activateManualUpdateState();
      
      this.currentTime = targetTime;
      this.animState.play();
      this.animState.time = this.currentTime;
      // sequence.sequenceController.masterSequence.RefreshElapsedTime(sequence);

      return this;
  }

  setToBeginning() {
    this.setSequenceTimeWithoutCallbacks(this.node, 0);
  }

  ActivateForwardAutoplayState(targetSpeed: number)
  {
    // if (audioMuted == true) {
    //     EnableAudioSources();
    // }
    
    if (this.sequenceUpdateState == Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.MANUAL_UPDATE] ||
        this.animState.speed < 1) {
        this.SetSpeed(targetSpeed);
        this.animState.play();
        this.animState.time = this.currentTime;
        this.sequenceUpdateState = Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.FORWARD_AUTOPLAY];
    }
  }

  SetSpeed(targetSpeed: number)
  {
    this.currentSpeed = targetSpeed; // This value is for debugging purposes  
    this.animState.speed = targetSpeed;
  }

  activateManualUpdateState()
  {
      // if (this.audioMuted == false) {
      //     MuteAudioSources();
      // }
      
      // We must be playing in manual update state in order
      // for timeline to evaluate animation tracks

      // playableDirector.Play();
      // this.animState.play();
      this.SetSpeed(0);
      this.sequenceUpdateState = Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.MANUAL_UPDATE];
  }

  mplay() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
    console.log("play");
  }
  mpause() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
    console.log("paused");
  }
  mend() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
    console.log("end");
  }

}
