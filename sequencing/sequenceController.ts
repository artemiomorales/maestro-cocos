import { _decorator, Component, AnimationComponent, Node, AnimationState, AnimationClip, CCFloat, find, Enum, EventHandler, TextAsset } from 'cc';

import AppSettings from '../persistentData/appSettings';

import { COMPLEX_EVENT, CONSTANTS, DESTINATION_ACTIVATION_TYPE, DESTINATION_TYPE, INTERNAL_COMPLEX_EVENT } from '../constants';
import ComplexPayload from '../complexPayload';
import { IForkDestinationPayload } from './iForkDestinationPayload';
import { ISetDestinationStatusPayload } from './iSetDestinationStatusPayload';

const { ccclass, property } = _decorator;

var SEQUENCE_UPDATE_STATE = Enum({
  FORWARD_AUTOPLAY: -1,
  MANUAL_UPDATE: -1
});


@ccclass('Destination')
export class Destination {

  @property({type:TextAsset, visible: true, tooltip: "Only required if there are multiple destinations"})
  public _branchKey: TextAsset = null!;
  public get branchKey() {
    return this._branchKey;
  }
  public set branchKey(value: TextAsset) {
    this._branchKey = value;
  }

  @property({type:Node, visible: true, tooltip: "Each destination must be a sequence controller"})
  public _sequenceNode: Node = null!;
  public get sequenceNode() {
    return this._sequenceNode;
  }
  public set sequenceNode(value: Node) {
    this._sequenceNode = value;
  }

  @property({type:DESTINATION_ACTIVATION_TYPE, visible: true, tooltip: "Only required if there are multiple destinations"})
  public _activationType: number = null!;
  public get activationType() {
    return this._activationType;
  }
  public set activationType(value: number) {
    this._activationType = value;
  }

}


@ccclass('DestinationConfig')
export class DestinationConfig {

  @property({visible: true})
  private _activeByDefault = true;
  public get activeByDefault() {
    return this._activeByDefault;
  }
  public set activeByDefault(value: boolean) {
    this._activeByDefault = value;
  }

  @property({type:TextAsset, visible: true, tooltip: "Only required if there are multiple destinations"})
  public _originKey: TextAsset = null!;
  public get originKey() {
    return this._originKey;
  }
  public set originKey(value: TextAsset) {
    this._originKey = value;
  }

  @property({type:TextAsset, visible: true, tooltip: "Only required if there are multiple destinations"})
  public _defaultDestinationKey: TextAsset = null!;
  public get defaultDestinationKey() {
    return this._defaultDestinationKey;
  }
  public set defaultDestinationKey(value: TextAsset) {
    this._defaultDestinationKey = value;
  }

  @property({type:[Destination], visible: true, tooltip: "Each destination must be a sequence controller"})
  public _destinations: Destination[] = [];
  public get destinations() {
    return this._destinations;
  }
  public set destinations(value: Destination[]) {
    this._destinations = value;
  }

}

@ccclass('JoinConfig')
export class JoinConfig {

  @property({type:DestinationConfig, visible: true})
  public _previousDestination: DestinationConfig = new DestinationConfig();
  public get previousDestination() {
    return this._previousDestination;
  }
  public set previousDestination(value: DestinationConfig) {
    this._previousDestination = value;
  }


  @property({type:DestinationConfig, visible: true})
  public _nextDestination: DestinationConfig = new DestinationConfig();
  public get nextDestination() {
    return this._nextDestination;
  }
  public set nextDestination(value: DestinationConfig) {
    this._nextDestination = value;
  }
}

@ccclass('SequenceController')
export default class SequenceController extends Component {
    
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

  @property({type: JoinConfig, visible: true})
  private _joinConfig: JoinConfig = new JoinConfig();
  public get joinConfig() {
    return this._joinConfig;
  }
  public set joinConfig(value: JoinConfig) {
    this._joinConfig = value;
  }
  
  private _currentTime: number = 0;
  public get currentTime() {
    return this._currentTime;
  }
  public set currentTime(value: number) {
    this._currentTime = value;
  }
  
  private _currentSpeed: number = 0;
  public get currentSpeed() {
    return this._currentSpeed;
  }
  public set currentSpeed(value: number) {
    this._currentSpeed = value;
  }

  private _duration: number = 0;
  public get duration() {
    return this._duration;
  }
  public set duration(value: number) {
    this._duration = value;
  }

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

  @property({type: [EventHandler], visible: true})
  private _joinActivateEvent: EventHandler[] = [];
  public get joinActivateEvent() {
    return this._joinActivateEvent;
  }
  public set joinActivateEvent(value: EventHandler[]) {
    this._joinActivateEvent = value;
  }

  @property({type: [EventHandler], visible: true})
  private _joinDeactivateEvent: EventHandler[] = [];
  public get joinDeactivateEvent() {
    return this._joinDeactivateEvent;
  }
  public set joinDeactivateEvent(value: EventHandler[]) {
    this._joinDeactivateEvent = value;
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
    } else {
      throw "Default clip must be specified on animation component " + this.node.name + " in order to use Sequence Controller." 
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

  setActiveTrue() {
    this.active = true;
  }

  setActiveFalse() {
    this.active = false;
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
        complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], this);
        this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], complexPayload)
        this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], complexPayload)
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
    this.setSequenceTimeWithoutModuleCallbacks(this.node, 0);

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
    this.setSequenceTimeWithoutModuleCallbacks(this.node, this.duration);

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
      complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], this);

      this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], complexPayload)
      this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], complexPayload)

      return this;
  }

  setSequenceTimeWithoutModuleCallbacks(caller: Node, targetTime: number)
  {
      // if (sequence.paused == true) return sequence;
      
      this.activateManualUpdateState();
      
      this.currentTime = targetTime;
      this.animState.play();
      this.animState.time = this.currentTime;

      const complexPayload = new ComplexPayload();
      complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this);
      complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], this);

      this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME], complexPayload)

      return this;
  }

  setToBeginning() {
    this.setSequenceTimeWithoutModuleCallbacks(this.node, 0);
  }

  activateForwardAutoplayState(targetSpeed: number)
  {
    // if (audioMuted == true) {
    //     EnableAudioSources();
    // }
    
    if (this.sequenceUpdateState == Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.MANUAL_UPDATE] ||
        this.animState.speed < 1) {
        this.setSpeed(targetSpeed);
        this.animState.play();
        this.animState.time = this.currentTime;
        this.sequenceUpdateState = Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.FORWARD_AUTOPLAY];
    }
  }

  setSpeed(targetSpeed: number)
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
      this.setSpeed(0);
      this.sequenceUpdateState = Object.keys(SEQUENCE_UPDATE_STATE)[SEQUENCE_UPDATE_STATE.MANUAL_UPDATE];
  }

  static frameToLocalTime(sequence: SequenceController, frame: number)
  {
    const animationClip: any = sequence.animationClip;
    return frame / animationClip.frameRate;
  }

  triggerJoinActivateEvent() {
    EventHandler.emitEvents(this.joinActivateEvent);
  }

  triggerJoinDeactivateEvent() {
    EventHandler.emitEvents(this.joinDeactivateEvent);
  }

  setPreviousDestination(destinationKey: string) {
    
    const complexPayload = new ComplexPayload();
    const payload: IForkDestinationPayload = {
      sequence: this,
      branchKey: destinationKey,
      destinationType: DESTINATION_TYPE.previous
    }
    complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], payload);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], complexPayload)

    // const destination = SequenceController.getDestinationViaKey(destinationKey, this.joinConfig.previousDestination);
    // if(destination) {
    //   this.joinConfig.previousDestination.defaultDestinationKey = destination.branchKey;
    // } else {
    //   throw 'Destination key not found in node list in ' + this.name + '. Did you populate branch keys on your target sequence contollers?'
    // }

  }

  setNextDestination(destinationKey: string) {
        
    const complexPayload = new ComplexPayload();
    const payload: IForkDestinationPayload = {
      sequence: this,
      branchKey: destinationKey,
      destinationType: DESTINATION_TYPE.next
    }
    complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], payload);

    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], complexPayload)

    // const destination = SequenceController.getDestinationViaKey(destinationKey, this.joinConfig.nextDestination);
    // if(destination) {
    //   this.joinConfig.nextDestination.defaultDestinationKey = destination.branchKey;
    // } else {
    //   throw 'Destination key not found in node list in ' + this.name + '. Did you populate branch keys on your target sequence contollers?'
    // }

  }

  activateNextDestination(){
    this.triggerSetNextDestinationStatus(true);
  }

  deactivateNextDestination(){
    this.triggerSetNextDestinationStatus(false);
  }

  private triggerSetNextDestinationStatus(targetStatus: boolean) {
    const complexPayload = new ComplexPayload();
    const payload: ISetDestinationStatusPayload = {
      sequence: this,
      targetStatus: targetStatus,
    };
    complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_NEXT_DESTINATION_STATUS], payload);
    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_NEXT_DESTINATION_STATUS], complexPayload)
  }

  activatePreviousDestination(){
    this.triggerSetPreviousDestinationStatus(true);
  }

  deactivatePreviousDestination(){
    this.triggerSetPreviousDestinationStatus(false);
  }

  private triggerSetPreviousDestinationStatus(targetStatus: boolean) {
    const complexPayload = new ComplexPayload();
    const payload: ISetDestinationStatusPayload = {
      sequence: this,
      targetStatus: targetStatus,
    };
    complexPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_PREVIOUS_DESTINATION_STATUS], payload);
    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_PREVIOUS_DESTINATION_STATUS], complexPayload)
  }

  static getDestinationViaKey(destinationKey: string, destinationConfig: DestinationConfig) {
    const destination = destinationConfig.destinations.find(x => {
      const sequenceController = x.sequenceNode.getComponent(SequenceController) as SequenceController;
      if(sequenceController && destinationKey === x.branchKey.name) {
        return true;
      }
    });

    return destination;
  }

  mplay() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
  }
  mpause() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
  }
  mend() {
    this.animState.speed = this.currentSpeed;
    this.animState.play();
    this.animState.time = this.currentTime;
  }


}