
import { _decorator, Component, Node, find } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, INTERNAL_COMPLEX_EVENT, SIMPLE_EVENT } from '../constants';
import SequenceController, { DestinationConfig } from './sequenceController';
import AppSettings from '../persistentData/appSettings';
import { JoinerDataDictionary } from './joinerDataDictionary';
import { RootConfig } from './rootConfig';
import { JoinerData } from './joinerData';
const { ccclass, property } = _decorator;

@ccclass('Joiner')
export class Joiner extends Component {

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

  // private _joinerDataCollection: JoinerDataDictionary[] = [];
  // public get joinerDataCollection() {
  //   return this._joinerDataCollection;
  // }
  // public set joinerDataCollection(value: JoinerDataDictionary[]) {
  //   this._joinerDataCollection = value;
  // }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], this.callActivateNextSequence, this);
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], this.callActivatePreviousSequence, this);

    this.configureData();
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], this.callActivateNextSequence, this);
    this.appSettingsNode.off(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], this.callActivatePreviousSequence, this);
  }

  callActivateNextSequence(complexPayload: ComplexPayload) {
    console.log(complexPayload);
    const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE]);
      this.activateNextSequence(sourceSequence);
  }

  callActivatePreviousSequence(complexPayload: ComplexPayload) {
    const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE]);
      this.activatePreviousSequence(sourceSequence);
  }

  configureData()
  {
      // this.joinerDataCollection = [];
      // //forkDataCollection.Clear();

      // for (let i = 0; i < this.masterSequences.length; i++)
      // {
      //   for (let q = 0; q < this.masterSequences[i].sequenceControllers.length; q++) {
            
      //     var sequence = this.masterSequences[i].sequenceControllers[q];

      //     Joiner.setJoinData(this, sequence);
      //   }
      // }
  }


  // static setJoinData(joiner: Joiner, sequence: SequenceController) : Joiner
  // {
  //     // We need to make an entry for every sequence, regardless of whether it
  //     // has any sibling sequences, so we know when we've reached the end of a path

  //     let hasBeenAdded = false;

  //     for(let i=0; i<joiner.joinerDataCollection.length; i++) {
  //       if(joiner.joinerDataCollection[i].sequence === sequence) {
  //         hasBeenAdded = true;
  //       }
  //     }

  //     if(!hasBeenAdded) {
  //       const joinerDataDictionary = new JoinerDataDictionary();

  //       const previousJoinData = new JoinerData();
  //       const previousDestinationConfig = sequence.joinConfig.previousDestination;
  //       if(previousDestinationConfig.destinations.length > 1) {
  //         previousJoinData.isFork = true;
  //       }
  //       for(let i=0; i<previousDestinationConfig.destinations.length; i++) {
  //         previousJoinData.previousDestination.push(previousDestinationConfig.destinations[i].getComponent(SequenceController) as SequenceController);
  //       }
        
  //       const nextDestinationConfig = sequence.joinConfig.nextDestination;
  //       if(nextDestinationConfig.destinations.length > 1) {
  //         // TO DO -- add support for forks
  //       } else if(sequence.nextDestination.length === 1) {
  //         previousJoinData.nextDestination.push(sequence.nextDestination[0].destination.getComponent(SequenceController) as SequenceController);
  //       }

  //       joinerDataDictionary.sequence = sequence;
  //       joinerDataDictionary.joinerData = previousJoinData;
  //       joiner.joinerDataCollection.push(joinerDataDictionary);
  //     }
      
  //     return joiner;
  // }

  activatePreviousSequence (sourceSequence: SequenceController) {
    // const sequenceSettings: JoinerData | undefined = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData;

    const joinConfig = sourceSequence.joinConfig;
    const previousDestinationConfig = joinConfig.previousDestination;

    if(!joinConfig.previousDestination.active) {
      return;
    }

    if (previousDestinationConfig.destinations.length > 0)
    {
      let previousSequence: SequenceController;
      
      if (previousDestinationConfig.destinations.length === 1) {
          sourceSequence.active = false;
          previousSequence = previousDestinationConfig.destinations[0].getComponent(SequenceController) as SequenceController;
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
      } else {
        sourceSequence.active = false;
        const destinationSequence = Joiner.getDestination(previousDestinationConfig);
        if(!destinationSequence) {
          throw("Unable to find destination on " + sourceSequence.name + ". Did you populate your branch and branch keys correctly?")
        }

        for(let i=0; i<previousDestinationConfig.destinations.length; i++) {
          const sequence = previousDestinationConfig.destinations[i].getComponent(SequenceController) as SequenceController;
          sequence.active = false;
        }

        destinationSequence.active = true;
        destinationSequence.triggerJoinDeactivateEvent();
        destinationSequence.setSequenceTime(this.node, destinationSequence.duration);

        if(destinationSequence !== sourceSequence) {
          sourceSequence.triggerJoinDeactivateEvent();
        }
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
    }
    // else
    // {
    //     boundaryReached.RaiseEvent(this.gameObject, sourceSequence);
    // }

    return sourceSequence;
  }

  activateNextSequence (sourceSequence: SequenceController) {
    // const sequenceSettings: JoinerData | undefined = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData;

    const joinConfig = sourceSequence.joinConfig;
    const nextDestinationConfig = joinConfig.nextDestination;

    if(!joinConfig.nextDestination.active) {
      return;
    }


    if (nextDestinationConfig.destinations.length > 0) {
        let nextSequence: SequenceController;
        
        if (nextDestinationConfig.destinations.length === 1) {
            sourceSequence.active = false;
            nextSequence = nextDestinationConfig.destinations[0].getComponent(SequenceController) as SequenceController;
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
        } else {
          sourceSequence.active = false;
          const destinationSequence = Joiner.getDestination(nextDestinationConfig);
          if(!destinationSequence) {
            throw("Unable to find destination on " + sourceSequence.name + ". Did you populate your branch and branch keys correctly?")
          }
          
          for(let i=0; i<nextDestinationConfig.destinations.length; i++) {
            const sequence = nextDestinationConfig.destinations[i].getComponent(SequenceController) as SequenceController;
            sequence.active = false;
          }

          destinationSequence.active = true;
          destinationSequence.triggerJoinActivateEvent();   
          destinationSequence.setSequenceTime(this.node, 0);

          console.log(destinationSequence);

          // In some cases, namely looping, we don't
          // want to deactivate the playable director
          if (destinationSequence !== sourceSequence) {
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
    }
    // else
    // {
    //     boundaryReached.RaiseEvent(this.gameObject, sourceSequence);
    // }

    return sourceSequence;
  }

  static getDestination(destinationConfig: DestinationConfig) {
    const destinationKey = destinationConfig.destinationKey;
    if(destinationKey) {
      const destination = destinationConfig.destinations.find(x => {
        const sequenceController = x.getComponent(SequenceController) as SequenceController;
        console.log(sequenceController);
        if(sequenceController && destinationKey === sequenceController.joinConfig.branchKey) {
          return true;
        }
      });

      if(destination) {
        return destination.getComponent(SequenceController) as SequenceController;
      } 
    
    }

  }

}