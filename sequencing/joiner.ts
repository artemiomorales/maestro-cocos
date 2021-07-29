
import { _decorator, Component, Node, find } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, DESTINATION_ACTIVATION_TYPE, DESTINATION_TYPE, INTERNAL_COMPLEX_EVENT, SIMPLE_EVENT } from '../constants';
import SequenceController, { DestinationConfig } from './sequenceController';
import AppSettings from '../persistentData/appSettings';
import { RootConfig } from './rootConfig';
import { IJoinerDestination } from './iJoinerDestination';
import { BranchingPath } from './branchingPath';
import { SimpleJoinerDestination } from './simpleJoinerDestination';
import { ForkJoinerDestination } from './forkJoinerDestination';
import { TouchForkJoinerDestination } from './touchForkJoinerDestination';
import { IForkDestinationPayload } from './iForkDestinationPayload';
const { ccclass, property } = _decorator;

@ccclass('JoinerData')
export class JoinerData {

  private _previousDestination: IJoinerDestination | null = null!;
  public get previousDestination() {
    return this._previousDestination;
  }
  public set previousDestination(value: IJoinerDestination | null) {
    this._previousDestination = value;
  }

  private _nextDestination: IJoinerDestination | null = null!;
  public get nextDestination() {
    return this._nextDestination;
  }
  public set nextDestination(value: IJoinerDestination | null) {
    this._nextDestination = value;
  }

}

@ccclass('SequenceJoinerDictionary')
export class SequenceJoinerDictionary {

  private _sequence: SequenceController = null!;
  public get sequence() {
    return this._sequence;
  }
  public set sequence(value: SequenceController) {
    this._sequence = value;
  }

  private _joinerData: JoinerData = new JoinerData();
  public get joinerData() {
    return this._joinerData;
  }
  public set joinerData(value: JoinerData) {
    this._joinerData = value;
  }

}


@ccclass('Joiner')
export default class Joiner extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }

  public get masterSequences() {
    return this.rootConfig.masterSequences;
  }

  public get touchBranchKeys() {
    return this.appSettings.getTouchBranchKeys(this.node);
  }

  public get forkTransitionActive() {
    return this.appSettings.getForkTransitionActive(this.node);
  }
  public set forkTransitionActive(value: boolean) {
    this.appSettings.setForkTransitionActive(this.node, value);
  }

  private _joinerDataCollection: SequenceJoinerDictionary[] = [];
  public get joinerDataCollection() {
    return this._joinerDataCollection;
  }
  public set joinerDataCollection(value: SequenceJoinerDictionary[]) {
    this._joinerDataCollection = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], this.callActivateNextSequence, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], this.callActivatePreviousSequence, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], this.setForkDestination, this);


    this.configureData();
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], this.callActivateNextSequence, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], this.callActivatePreviousSequence, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION], this.setForkDestination, this);
  }

  callActivateNextSequence(complexPayload: ComplexPayload) {
    const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE]);
      this.activateNextSequence(sourceSequence);
  }

  callActivatePreviousSequence(complexPayload: ComplexPayload) {
    const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE]);
      this.activatePreviousSequence(sourceSequence);
  }

  setForkDestination(complexPayload: ComplexPayload) {
    const forkDestinationPayload: IForkDestinationPayload = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.SET_FORK_DESTINATION]);
    
    const { sequence, branchKey, destinationType } = forkDestinationPayload;

    let targetFork: ForkJoinerDestination = null!;

    if(destinationType === DESTINATION_TYPE.previous) {
     targetFork = this.joinerDataCollection.find(x => x.sequence === sequence)?.joinerData.previousDestination as ForkJoinerDestination;
    } else if(destinationType === DESTINATION_TYPE.next) {
      targetFork = this.joinerDataCollection.find(x => x.sequence === sequence)?.joinerData.nextDestination as ForkJoinerDestination;
    } else {
      throw "Unable to set fork destination! Complex payload is not configured properly";
    }

    targetFork.setDestinationViaString(sequence.node, branchKey);
  }

  configureData()
  {
    this.joinerDataCollection = [];
    //forkDataCollection.Clear();

    for (let i = 0; i < this.masterSequences.length; i++)
    {
      for (let q = 0; q < this.masterSequences[i].sequenceControllers.length; q++) {
          
        Joiner.setJoinData(this, this.masterSequences[i].sequenceControllers[q]);
      }
    }
  }

  setForkStatus(targetStatus: boolean)
  {
    this.forkTransitionActive = targetStatus;
  }

  static setJoinData(joiner: Joiner, sequence: SequenceController) : Joiner
  {
      // We need to make an entry for every sequence, regardless of whether it
      // has any sibling sequences, so we know when we've reached the end of a path

      // let hasBeenAdded = false;

      // for(let i=0; i<this.joinerDataCollection.length; i++) {
      //   if(this.joinerDataCollection[i].sequence === sequence) {
      //     hasBeenAdded = true;
      //   }
      // }

      // if(!hasBeenAdded) {
      // }

      const sequenceJoinerDictionary = new SequenceJoinerDictionary();
      sequenceJoinerDictionary.sequence = sequence;

      /// Let's create and populate our joiner data
      sequenceJoinerDictionary.joinerData.previousDestination = Joiner.getJoinerDestinationConfig(joiner, sequence.joinConfig.previousDestination);
      sequenceJoinerDictionary.joinerData.nextDestination = Joiner.getJoinerDestinationConfig(joiner, sequence.joinConfig.nextDestination);

      joiner.joinerDataCollection.push(sequenceJoinerDictionary);
      
      return joiner;
  }

  static getJoinerDestinationConfig(joiner: Joiner, destinationConfig: DestinationConfig) : IJoinerDestination | null
  {
    if(destinationConfig.destinations.length === 1) {
      return new SimpleJoinerDestination(destinationConfig.activeByDefault, destinationConfig.destinations[0].sequenceNode.getComponent(SequenceController) as SequenceController);

    } else if (destinationConfig.destinations.length > 1) {
      const branchingPaths: BranchingPath[] = [];

      for(let i=0; i<destinationConfig.destinations.length; i++) {
        const destination = destinationConfig.destinations[i];
        branchingPaths.push(new BranchingPath(destination.branchKey, destination.sequenceNode.getComponent(SequenceController) as SequenceController, Object.keys(DESTINATION_ACTIVATION_TYPE)[destination.activationType]))
      }
      
      let fork: ForkJoinerDestination | TouchForkJoinerDestination;

      if(!Joiner.isTouchFork(joiner, destinationConfig)) {
        fork = new ForkJoinerDestination(destinationConfig.activeByDefault, branchingPaths);
      } else {
        fork = new TouchForkJoinerDestination(destinationConfig.activeByDefault, destinationConfig.originKey, branchingPaths);
      }

      if(destinationConfig.defaultDestinationKey) {
        fork.setDestinationViaTextAsset(joiner.node, destinationConfig.defaultDestinationKey);
      }

      return fork;
     
    }

    return null;
  }

  static isTouchFork(joiner: Joiner, destinationConfig: DestinationConfig) {
    let originIsTouch = false;
    let destinationIsTouchCounter = 0;
    for(let i=0; i<joiner.touchBranchKeys.length; i++) {
      // Check if the origin is a touch branch
      const touchBranchKey = joiner.touchBranchKeys[i];
      if(destinationConfig.originKey === touchBranchKey) {
        originIsTouch = true;
      }
      // Check if all destinations are touch branches
      for(let q=0; q<destinationConfig.destinations.length; q++) {
        const destination = destinationConfig.destinations[q];
        if(destination.branchKey === touchBranchKey) {
          destinationIsTouchCounter++;
        }
      }
    }
    
    if((!originIsTouch && destinationIsTouchCounter > 0) || (destinationIsTouchCounter > 0 && destinationIsTouchCounter < destinationConfig.destinations.length -1) ) {
      console.log("Inconsistent destination definitions when creating touch branch. Are your destinations and branch keys set correctly? Touch branch configuration aborted.");
    }

    if(originIsTouch && destinationIsTouchCounter >= destinationConfig.destinations.length - 1) {
      return true;
    }

    return false;
  }

  activatePreviousSequence (sourceSequence: SequenceController) {
    const previousDestination: IJoinerDestination = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData.previousDestination as IJoinerDestination;

    if(!previousDestination || !previousDestination.active) {
      return;
    }
    // const joinConfig = sourceSequence.joinConfig;
    // const previousDestinationConfig = joinConfig.previousDestination;

    if (previousDestination instanceof SimpleJoinerDestination) {
      console.log(previousDestination);
      sourceSequence.active = false;
      const previousSequence: SequenceController = previousDestination.sequence;
      previousSequence.active = true;
      previousSequence.triggerJoinActivateEvent();
      previousSequence.setSequenceTime(this.node, previousSequence.duration);
      // previousSequence.sequenceController.masterSequence.RefreshElapsedTime(previousSequence);
      // rootConfig.sequenceModified.RaiseEvent(this.gameObject);
      
      // In some cases, like looping, we don't
      // want to deactivate the playable director
      if(previousSequence !== sourceSequence) {
        sourceSequence.triggerJoinDeactivateEvent();
      }
      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.AUTOPLAY_ACTIVATE]);

    } else if(previousDestination instanceof ForkJoinerDestination) {

      if(!previousDestination.destinationBranch) {
        this.callTriggerSequenceBoundaryReached(sourceSequence);
        return;
      }

      const previousSequence: SequenceController = previousDestination.destinationBranch.sequence;
      if(!previousSequence) {
        this.callTriggerSequenceBoundaryReached(sourceSequence);
        return;
      }
      sourceSequence.active = false;
      for(let i=0; i<previousDestination.branchingPaths.length; i++) {
        previousDestination.branchingPaths[i].sequence.active = false;
      }

      previousSequence.active = true;
      previousSequence.triggerJoinActivateEvent();
      const targetTime = previousDestination.destinationBranch.activationType === Object.keys(DESTINATION_ACTIVATION_TYPE)[DESTINATION_ACTIVATION_TYPE.SET_TO_END] ? previousSequence.duration : 0;
      previousSequence.setSequenceTime(this.node, targetTime);

      if(previousSequence !== sourceSequence) {
        sourceSequence.triggerJoinDeactivateEvent();
      }

      const sequenceActivatedPayload = new ComplexPayload();
      sequenceActivatedPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_ACTIVATED], previousSequence);
      this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_ACTIVATED], sequenceActivatedPayload);


      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.AUTOPLAY_ACTIVATE]);
    }
      // else if (sequenceSettings.previousDestination is Fork fork) {
      //   if (fork.active == false || fork.TryGetDestinationBranch(out BranchingPath destinationBranch) == false) {
      //       boundaryReached.RaiseEvent(this.gameObject, sourceSequence);
      //   }
      //   else {
      //     previousSequence = destinationBranch.sequence;
      //     if (previousSequence != sourceSequence) {
      //       for (int i = 0; i < fork.branchingPaths.Count; i++) {
      //           fork.branchingPaths[i].sequence.active = false;
      //       }
      //       previousSequence.active = true;
      //       previousSequence.sequenceController.gameObject.SetActive(true);
      //       ForkData previousForkData = forkDataCollection[previousSequence].Find(x => x.fork == fork);
      //       double targetTime = previousForkData.markerPlacement == MarkerPlacement.StartOfSequence  ? 0d : previousSequence.sourcePlayable.duration;
      //       previousSequence.sequenceController.SetSequenceTime(this, (float) targetTime);
      //       previousSequence.sequenceController.masterSequence.RefreshElapsedTime(previousSequence);
      //       rootConfig.sequenceModified.RaiseEvent(this.gameObject);
      //       sourceSequence.sequenceController.gameObject.SetActive(false);
      //       autoplayActivate.RaiseEvent(this.gameObject);
      //     }
      //   }
      // }
    
    else
    {
      this.callTriggerSequenceBoundaryReached(sourceSequence);
    }

    return sourceSequence;
  }

  activateNextSequence (sourceSequence: SequenceController) {
    const nextDestination: IJoinerDestination = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData.nextDestination as IJoinerDestination;

    if(!nextDestination || !nextDestination.active) {
      return;
    }

    if (nextDestination instanceof SimpleJoinerDestination) {
        sourceSequence.active = false;
        let nextSequence: SequenceController = nextDestination.sequence
        nextSequence.active = true;
        nextSequence.triggerJoinActivateEvent();
        // nextSequence.sequenceController.gameObject.SetActive(true);
        nextSequence.setSequenceTime(this.node, 0);
        // nextSequence.sequenceController.masterSequence.RefreshElapsedTime(nextSequence);
        // rootConfig.sequenceModified.RaiseEvent(this.gameObject);
        
        // In some cases, namely looping, we don't
        // want to deactivate the playable director
        if (nextSequence !== sourceSequence) {
          sourceSequence.triggerJoinDeactivateEvent();
        }
        this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.AUTOPLAY_ACTIVATE]);
    } else if(nextDestination instanceof ForkJoinerDestination) {

      if(!nextDestination.destinationBranch) {
        this.callTriggerSequenceBoundaryReached(sourceSequence);
        return;
      }

      const nextSequence = nextDestination.destinationBranch.sequence;
      if(!nextSequence) {
        this.callTriggerSequenceBoundaryReached(sourceSequence);
        return;
      }
      sourceSequence.active = false;
      for(let i=0; i<nextDestination.branchingPaths.length; i++) {
        nextDestination.branchingPaths[i].sequence.active = false;
      }

      nextSequence.active = true;
      nextSequence.triggerJoinActivateEvent();   
      const targetTime = nextDestination.destinationBranch.activationType === Object.keys(DESTINATION_ACTIVATION_TYPE)[DESTINATION_ACTIVATION_TYPE.SET_TO_END] ? nextSequence.duration : 0;
      nextSequence.setSequenceTime(this.node, targetTime);

      // In some cases, namely looping, we don't
      // want to deactivate the playable director
      if (nextSequence !== sourceSequence) {
        sourceSequence.triggerJoinDeactivateEvent();
      }

      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.AUTOPLAY_ACTIVATE]);
    }
    // else if (sequenceSettings.nextDestination is Fork fork) {
    //     if (fork.active == false || fork.TryGetDestinationBranch(out BranchingPath destinationBranch) == false) {
    //         boundaryReached.RaiseEvent(this.gameObject, sourceSequence);
    //     }
    //     else {
    //         nextSequence = destinationBranch.sequence;  
    //         if (nextSequence != sourceSequence) {
    //             for (int i = 0; i < fork.branchingPaths.Count; i++) {
    //                 fork.branchingPaths[i].sequence.active = false;
    //             }
    //             nextSequence.active = true;
    //             nextSequence.sequenceController.gameObject.SetActive(true);
    //             ForkData nextForkData = forkDataCollection[nextSequence].Find(x => x.fork == fork);
    //             double targetTime = nextForkData.markerPlacement == MarkerPlacement.StartOfSequence ? 0d : nextSequence.sourcePlayable.duration;
    //             nextSequence.sequenceController.SetSequenceTime(this, (float)targetTime);
    //             nextSequence.sequenceController.masterSequence.RefreshElapsedTime(nextSequence);
    //             rootConfig.sequenceModified.RaiseEvent(this.gameObject);
                
    //             sourceSequence.sequenceController.gameObject.SetActive(false);
    //             autoplayActivate.RaiseEvent(this.gameObject);
    //         }    
    //     }
    // }
    
    else
    {
      this.callTriggerSequenceBoundaryReached(sourceSequence);
    }

    return sourceSequence;
  }

  callTriggerSequenceBoundaryReached(sequence: SequenceController) {
    const sequenceBoundaryReachedPayload = new ComplexPayload();
    sequenceBoundaryReachedPayload.set(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], sequence);
    this.appSettings.triggerComplexEvent(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ON_SEQUENCE_BOUNDARY_REACHED], sequenceBoundaryReachedPayload);
  }

  // static getDestinationNode(destinationConfig: ForkJoinerDestination) {
  //   const destinationKey = destinationConfig.defaultDestinationKey;
  //   if(destinationKey) {
  //     const destination = destinationConfig.destinations.find(x => {
  //       const sequenceController = x.sequenceNode.getComponent(SequenceController) as SequenceController;
  //       console.log(sequenceController);
  //       if(sequenceController && destinationKey === x.branchKey) {
  //         return true;
  //       }
  //     });

  //     if(destination) {
  //       return destination.sequenceNode.getComponent(SequenceController) as SequenceController;
  //     } 
    
  //   }

  // }

}