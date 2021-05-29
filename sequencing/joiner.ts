
import { _decorator, Component, Node, find } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, INTERNAL_COMPLEX_EVENT, SIMPLE_EVENT } from '../constants';
import { SequenceController } from './sequenceController';
import AppSettings from '../persistentData/appSettings';
import { JoinerDataCollection } from './joinerDataCollection';
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

  @property({type: [JoinerDataCollection], visible: true})
  private _joinerDataCollection: JoinerDataCollection[] = [];
  public get joinerDataCollection() {
    return this._joinerDataCollection;
  }
  public set joinerDataCollection(value: JoinerDataCollection[]) {
    this._joinerDataCollection = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE], (complexPayload: ComplexPayload) => {
      const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_NEXT_SEQUENCE]);
      this.activateNextSequence(sourceSequence);
    });
    this.appSettingsNode.on(Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE], (complexPayload: ComplexPayload) => {
      const sourceSequence = complexPayload.get(this.node, Object.keys(INTERNAL_COMPLEX_EVENT)[INTERNAL_COMPLEX_EVENT.ACTIVATE_PREVIOUS_SEQUENCE]);
      this.activatePreviousSequence(sourceSequence);
    });

    this.ConfigureData();
  }

  ConfigureData()
  {
      this.joinerDataCollection = [];
      //forkDataCollection.Clear();

      for (let i = 0; i < this.masterSequences.length; i++)
      {
        for (let q = 0; q < this.masterSequences[i].sequenceControllers.length; q++) {
            
          var sequence = this.masterSequences[i].sequenceControllers[q];

          Joiner.SetJoinData(this, sequence);
        }
      }
  }


  static SetJoinData(joiner: Joiner, sequence: SequenceController) : Joiner
  {
      // We need to make an entry for every sequence, regardless of whether it
      // has any sibling sequences, so we know when we've reached the end of a path

      let hasBeenAdded = false;

      for(let i=0; i<joiner.joinerDataCollection.length; i++) {
        if(joiner.joinerDataCollection[i].sequence === sequence) {
          hasBeenAdded = true;
        }
      }

      if(!hasBeenAdded) {
        const joinerDataCollection = new JoinerDataCollection();
        joinerDataCollection.sequence = sequence;
        const joinerData = new JoinerData();
        if(sequence.previousDestination.length > 1) {
          // TO DO -- add support for forks
        } else if(sequence.previousDestination.length === 1) {
          joinerData.previousDestination.push(sequence.previousDestination[0].destination.getComponent(SequenceController) as SequenceController);
        }

        if(sequence.nextDestination.length > 1) {
          // TO DO -- add support for forks
        } else if(sequence.nextDestination.length === 1) {
          joinerData.nextDestination.push(sequence.nextDestination[0].destination.getComponent(SequenceController) as SequenceController);
        }

        joinerDataCollection.joinerData = joinerData;
        joiner.joinerDataCollection.push(joinerDataCollection);
      }
      
      return joiner;
  }

  activatePreviousSequence (sourceSequence: SequenceController) {
    const sequenceSettings: JoinerData | undefined = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData;

    if (sequenceSettings && sequenceSettings.previousDestination.length > 0)
    {
      let previousSequence: SequenceController;
      
      if (!sequenceSettings.isFork) {
          sourceSequence.active = false;
          previousSequence = sequenceSettings.previousDestination[0];
          previousSequence.active = true;
          previousSequence.setSequenceTime(this.node, previousSequence.duration);
          // previousSequence.sequenceController.masterSequence.RefreshElapsedTime(previousSequence);
          // rootConfig.sequenceModified.RaiseEvent(this.gameObject);
          
          // In some cases, like looping, we don't
          // want to deactivate the playable director
          // if (previousSequence != sourceSequence) {
            // sourceSequence.sequenceController.gameObject.SetActive(false);
          // }
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
    const sequenceSettings: JoinerData | undefined = this.joinerDataCollection.find(x => x.sequence === sourceSequence)?.joinerData;

    if (sequenceSettings && sequenceSettings.nextDestination.length > 0) {
        let nextSequence: SequenceController;
        
        if (!sequenceSettings.isFork) {
            sourceSequence.active = false;
            nextSequence = sequenceSettings.nextDestination[0];
            nextSequence.active = true;
            // nextSequence.sequenceController.gameObject.SetActive(true);
            nextSequence.setSequenceTime(this.node, 0);
            // nextSequence.sequenceController.masterSequence.RefreshElapsedTime(nextSequence);
            // rootConfig.sequenceModified.RaiseEvent(this.gameObject);
            
            // In some cases, namely looping, we don't
            // want to deactivate the playable director
            // if (nextSequence != sourceSequence) {
              // sourceSequence.sequenceController.gameObject.SetActive(false);
            // }
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


}