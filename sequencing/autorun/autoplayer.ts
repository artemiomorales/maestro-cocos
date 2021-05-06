
import { _decorator, Component, Node, CCFloat, CCInteger, find } from 'cc';
import ComplexPayload from '../../complexPayload';
import { CONSTANTS, INTERNAL_COMPLEX_EVENT, SIMPLE_EVENT } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import MasterSequence from '../masterSequence';
import SequenceController from '../sequenceController';
import { AutorunController } from './autorunController';
import { AutorunData } from './autorunData';
import AutorunExtents from './autorunExtents';
import AutorunModule from './autorunModule';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('Autoplayer')
@executionOrder(10)
export default class Autoplayer extends Component implements AutorunModule {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({visible: true})
  private _moduleActive: boolean = false;
  public get moduleActive() {
    return this._moduleActive;
  }
  public set moduleActive(value: boolean) {
    this._moduleActive = value;
  }

  public get nodeElement() {
    return this.node;
  }

  @property({type: CCInteger, visible: true})
  private _priority: number = 0;
  public get priority() {
    return this._priority;
  }
  public set priority(value: number) {
    this._priority = value;
  }

  @property({type: CCFloat, visible: true})
  private _autoplayEaseThreshold: number = 0.25;
  public get autoplayEaseThreshold() {
    return this._autoplayEaseThreshold;
  }

  @property({type: AutorunController, visible: true})
  private _autorunController: AutorunController = null!;
  public get autorunController() {
    return this._autorunController;
  }
  public set autorunController(value: AutorunController) {
    this._autorunController = value;
  }

  public get inputController() {
    return this.autorunController;
  }

  public get frameStepValue() {
    return this.autorunController.appSettings.getFrameStepValue(this.node);
  }

  public get autorunThreshold() {
    return this.autorunController.appSettings.getAutorunThreshold(this.node);
  }

  Activate() {
    this.moduleActive = true;
  }

  Deactivate() {
    this.moduleActive = false;
  }

  TriggerInputActionComplete() {
    for (let i = 0; i < this.inputController.masterSequences.length; i++) {
      this.inputController.masterSequences[i].unlockInputModule(this.node);
    }
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], (complexPayload: ComplexPayload) => {
      const targetSequence = complexPayload.get(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED]);
      // console.log("autoplayer is responding");
      // if(targetSequence.active) {

      // }
      this.OnSequenceUpdated(targetSequence);
    });
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], () => {
      this.AutoplayAllSequences();
    });
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START], () => {
      this.DeactivateAutoplayAllSequences();
    });
  }

  // onDisable() {
  //   this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_UPDATED], this.OnSequenceUpdated);
  // }

  /// <summary>
  /// Given a target sequence, will search through our
  /// autorun data and either activate or deactivate autoplay.
  /// This should be called every time a sequence-timeline pair
  /// is updated. 
  /// </summary>
  /// <param name="targetSequence"></param>
  OnSequenceUpdated(targetSequence: SequenceController)
  {
      // if (moduleActive == false || appUtilsRequested == true || bookmarkLoadingCompleted == false) {
      //     return;
      // }

      // console.log("existing autorun data");
      // console.log(this.autorunController.autorunData);
      // console.log(targetSequence);

      if(this.moduleActive === false) {
        return;
      }
      
      var autorunData = this.autorunController.autorunData.find(x => x.sequenceController == targetSequence);

      // console.log("found autorun data");
      // console.log(autorunData);

      if (autorunData == null) return;

      const [modifiedAutorunData, registrationSuccessful] = this.AttemptRegisterAutorunModule(this, autorunData);

      // console.log("registrationSuccessful");
      // console.log(registrationSuccessful);
      
      if (registrationSuccessful == false) return;

      // If autoplay is currently active, deactivate and return if we're
      // beyond the thresholds of the extents where the autoplay originated.
      // (This is how we pause autoplay between intervals).
      // Note that, if looping is activated, we ignore intervals.
      if(this.HasValidAutoplayInterval(autorunData)) {

          if(this.autorunController.isReversing == false &&
              (targetSequence.currentTime + this.autorunThreshold > targetSequence.duration ||
              AutorunExtents.TimeBeyondEndThresholdExclusive(targetSequence.currentTime + this.autorunThreshold, autorunData.activeInterval))) {
              this.FinishForwardAutoplay(this, autorunData);
              return;
          }
          
          if (this.autorunController.isReversing == true &&
              (targetSequence.currentTime - this.autorunThreshold <= 0 ||
                AutorunExtents.TimeBeyondStartThresholdExclusive(targetSequence.currentTime - this.autorunThreshold, autorunData.activeInterval))) {
              this.FinishBackwardAutoplay(this, autorunData);
              return;
          }
          
      }
      
      // Note that the conditions for forward vs backward autoplay are different.
      if (this.autorunController.isReversing == false) {
          
          // For forward autoplay, once it's been activated, we
          // don't want to activate it again until the autoplay is either
          // interrupted or completed.
          if (autorunData.forwardUpdateActive == false) {
              Autoplayer.AttemptForwardAutoplay(this, autorunData);
          }
          autorunData.backwardUpdateActive = false;
      }
      else {
          
          // For backwards autoplay, we set the appropriate flags,
          // then the update is handled each frame via the Update() function.
          autorunData.activeAutorunModule = this as AutorunModule;
          autorunData.forwardUpdateActive = false;
          autorunData.backwardUpdateActive = true;
      }
  }

  TriggerAutorunIntervalComplete(autorunModule: AutorunModule, autorunData: AutorunData) : AutorunData
  {
      const targetSequence = autorunData.sequenceController;
      const targetMasterSequence: MasterSequence = this.autorunController.rootConfig.masterSequences.find(x => x.node === targetSequence.masterSequenceNode) as MasterSequence;
      
      autorunData.activeInterval = null!;
      autorunData.forwardUpdateActive = false;
      autorunData.backwardUpdateActive = false;
      autorunData.eligibleForAutoplay = false;
      autorunData.activeAutorunModule = null!;
      targetMasterSequence.requestDeactivateForwardAutoplay(targetSequence,
          autorunModule.priority, autorunModule.nodeElement.name);
      // autorunData.easingUtility.Reset();

      return autorunData;
  }

  HasValidAutoplayInterval(autorunData: AutorunData) : boolean
  {
      // if (autorunData.loop == false && autorunData.activeInterval != null) {
      //     return true;
      // }
      if (autorunData.activeInterval !== null) {
          return true;
      }

      return false;
  }

  FinishForwardAutoplay(autoplayer: Autoplayer, autorunData: AutorunData) : AutorunData
  {
      const targetSequence: SequenceController = autorunData.sequenceController;
      
      const currentInterval: AutorunExtents = autorunData.activeInterval;
      autoplayer.TriggerAutorunIntervalComplete(autoplayer, autorunData);
      autoplayer.TriggerInputActionComplete();
              
      if (currentInterval.endTime >= targetSequence.duration) {
          autorunData.sequenceController.setEndBoundaryReached(autoplayer.node);
      }
      else {
          autorunData.sequenceController.setSequenceTimeWithoutCallbacks(autoplayer.node, currentInterval.endTime);
      }
      
      return autorunData;
  }
  
  FinishBackwardAutoplay(autoplayer: Autoplayer, autorunData: AutorunData)
  {
      const currentInterval: AutorunExtents = autorunData.activeInterval;
      autoplayer.TriggerAutorunIntervalComplete(autoplayer, autorunData);
      autoplayer.TriggerInputActionComplete();
              
      if (currentInterval.startTime == 0) {
          autorunData.sequenceController.setStartBoundaryReached(autoplayer.node);
      }
      else {
          autorunData.sequenceController.setSequenceTimeWithoutCallbacks(autoplayer.node, currentInterval.startTime);
      }
      
      return autorunData;
  }

  AttemptRegisterAutorunModule(autorunModule: AutorunModule, autorunData: AutorunData) : [AutorunData, boolean]
  {
    let registrationSuccessful = false;
    
    if (autorunData.activeAutorunModule == null) {
        autorunData.activeAutorunModule = autorunModule;
        registrationSuccessful = true;
    }
    
    else if (autorunData.activeAutorunModule != null &&
              autorunModule.priority > autorunData.activeAutorunModule.priority) {
        autorunData.activeAutorunModule = autorunModule;
        registrationSuccessful = true;
    }

    else if (autorunData.activeAutorunModule == autorunModule) {
        registrationSuccessful = true;
    }

    // console.log("inner registration successful");
    // console.log(registrationSuccessful);

    return [autorunData, registrationSuccessful];
  }

  /// <summary>
  /// We need to make a single explicit call to the MasterSequence
  /// in order to set the speed and trigger forward autoplay.
  /// (This is in contrast to backwards autoplay, wherein we send
  /// a modify request every frame). 
  /// </summary>
  /// <param name="autorunData"></param>
  /// <returns></returns>
  static AttemptForwardAutoplay(autoplayer: Autoplayer, autorunData: AutorunData) : AutorunData
  {
    // console.log("attempting forward autoplay");
    const targetMasterSequence: MasterSequence =
      autoplayer.autorunController.rootConfig.masterSequences.find(x => x.node === autorunData.sequenceController.masterSequenceNode) as MasterSequence;
    const targetSequence: SequenceController = autorunData.sequenceController; 
    
    const [currentInterval, withinThreshold] =
      AutorunExtents.TimeWithinThresholdLowerBoundsInclusiveDescending(targetSequence.currentTime, autorunData.autorunIntervals)
    if (withinThreshold) {
        const [modifiedSequence, requestSuccessful] = targetMasterSequence.RequestActivateForwardAutoplay(targetSequence,
            autoplayer.priority, autoplayer.node.name, 1);
      
        // We should only store the interval and activate autoplay
        // once our request has been accepted by the MasterSequence
        if(requestSuccessful) {
            
            // Once the active interval has been cached, we will use
            // it to determine whether autoplay should halt whenever the
            // sequence gets updated (see RefreshAutoplay() above)
            autorunData.activeAutorunModule = autoplayer;
            autorunData.activeInterval = currentInterval;
            autorunData.forwardUpdateActive = true;

            this.PauseMomentumIfNeeded(autoplayer.autorunController, autorunData);
        }
    }

    return autorunData;
  }

  /// <summary>
  /// This is handling for our reverse autoplay.
  /// </summary>
  update()
  {
    // if (this.moduleActive == false || appUtilsRequested == true || autorunController.isReversing == false) {
    //     return;
    // }

    if (this.moduleActive === false) {
      return;
    }

    for (let q = 0; q < this.autorunController.autorunData.length; q++) {
        
      var autorunData = this.autorunController.autorunData[q];
      
      if (autorunData.backwardUpdateActive == true) {
          this.AttemptReverseAutoplay(autorunData, this);
      }
    }
  }

  /// <summary>
  /// To play a sequence in reverse, we must do so manually every frame. Also,
  /// to be most consistent and smooth, it's best to do this via the Update() loop. 
  /// Given a set of autorun data then, this checks to see if the corresponding
  /// sequence's current time is within a valid set of extents, and if so,
  /// calculates the autoplay modifier and sends out a modify request.
  /// </summary>
  /// <param name="autorunData"></param>
  /// <returns></returns>
  AttemptReverseAutoplay(autorunData: AutorunData, autoplayer: Autoplayer)
  {
      if (this.SequenceOrAutoplayDeactivated(autorunData)) {
          return autorunData;
      }

      const [currentInterval, withinThreshold] = AutorunExtents.TimeWithinThresholdBothBoundsInclusive(autorunData.sequenceController.currentTime,
              autorunData.autorunIntervals);

      if (withinThreshold == false) {
          autoplayer.OnSequenceUpdated(autorunData.sequenceController);
          return autorunData;
      }

      const autorunController: AutorunController = autoplayer.autorunController;
      Autoplayer.PauseMomentumIfNeeded(autorunController, autorunData);

      autorunData.activeInterval = currentInterval;

      const autoplayModifer = Autoplayer.GetAutoplayModifier(autoplayer);
      // if (this.SequenceWithinEaseThreshold(autorunData.sequence, currentInterval, true, autoplayer.autoplayEaseThreshold)) {
      //     autoplayModifer *= CalculateModifierEase(autorunData.loop, autorunData.easingUtility);
      // }
      
      const targetMasterSequence: MasterSequence = autoplayer.autorunController.rootConfig.masterSequences.find(x => x.node === autorunData.sequenceController.masterSequenceNode) as MasterSequence;

      targetMasterSequence.requestModifySequenceTime(autorunData.sequenceController, autoplayer.priority, autoplayer.node.name, autoplayModifer);

      return autorunData;
  }

  SequenceOrAutoplayDeactivated(autorunData: AutorunData)
  {
      if (autorunData.sequenceController.active === false || autorunData.eligibleForAutoplay === false) {
          return true;
      }

      return false;
  }

  static PauseMomentumIfNeeded(autorunController: AutorunController, autorunData: AutorunData) : AutorunController
  {
      if (autorunController.pauseMomentumDuringAutorun == true) {
          // autorunController.TriggerPauseMomentum(autorunData.sequence);
      }

      return autorunController;
  }

  static GetAutoplayModifier(autoplayer: Autoplayer) : number
  {
     let autoplayModifier = 0.0166667;

     if(autoplayer.autorunController.isReversing === true) {
       autoplayModifier *= -1;
     }

     return autoplayModifier;

      // let autoplayModifer: number;
      
      // if (autoplayer.autorunController.useFrameStepValue == false) {
      //     autoplayModifer = Time.smoothDeltaTime;
      // }
      // else {
      //     autoplayModifer = autoplayer.frameStepValue;
      // }

      // if (autoplayer.autorunController.isReversing == true) {
      //     autoplayModifer *= -1f;
      // }

      // return autoplayModifer;
  }

  /// <summary>
  /// By default, we enable autoplay when certain conditions are met -
  /// i.e., a swipe a has completed, autoplay has been
  /// explicitly requested, or a sequence has been modified,
  /// either with our without explicit input (an example of the
  /// latter: a joiner activating a preceding or following sequence)
  /// </summary>
  AutoplayAllSequences()
  {
      for (let q = 0; q < this.autorunController.autorunData.length; q++) {
          const sequence: SequenceController = this.autorunController.autorunData[q].sequenceController;
          if (sequence.active == true) {
              this.autorunController.autorunData[q].eligibleForAutoplay = true;
              this.OnSequenceUpdated(sequence);
          }
      }
  }

  /// <summary>
  /// By default, we disable autoplay when app utils get requested,
  /// or a swipe begins.
  /// </summary>
  DeactivateAutoplayAllSequences()
  {
      for (let q = 0; q < this.autorunController.autorunData.length; q++) {
          const sequence: SequenceController = this.autorunController.autorunData[q].sequenceController;
          if (sequence.active == true) {
              this.TriggerAutorunIntervalComplete(this, this.autorunController.autorunData[q]);
          }
      }
  }



}
