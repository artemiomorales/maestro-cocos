
import { _decorator, Component, Node, CCInteger } from 'cc';
import InputModule from '../inputModule';
import SequenceController from '../sequenceController';
import { GenericInputController } from './genericInputController';
const { ccclass, property } = _decorator;

@ccclass('GenericInputModule')
export class GenericInputModule extends Component implements InputModule {

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

  @property({type: GenericInputController, visible: true})
  private _genericInputController: GenericInputController = null!;
  public get genericInputController() {
    return this._genericInputController;
  }
  public set genericInputController(value: GenericInputController) {
    this._genericInputController = value;
  }

  public get inputController() {
    return this.genericInputController;
  }

  activate() {
    this.moduleActive = true;
  }

  deactivate() {
    this.moduleActive = false;
  }

  triggerInputActionComplete() {
    for (let i = 0; i < this.inputController.masterSequences.length; i++) {
      this.inputController.masterSequences[i].unlockInputModule(this.node);
    }
  }

  triggerModifySequence(modifier: number)
  {
    for (let i = 0; i < this.inputController.inputData.length; i++) {
      const targetSequence = this.inputController.inputData[i].sequenceController;
      if (targetSequence.active == true) {
        this.applyModifier(this, targetSequence, modifier);
      }
    }
  }

  private applyModifier(source: GenericInputModule, targetSequence: SequenceController, timeModifier: number) {
    console.log("in generic");
    console.log(timeModifier);
    for(let i=0; i<this.inputController.rootConfig.masterSequences.length; i++) {
      let masterSequence = this.inputController.rootConfig.masterSequences[i];
      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {
        if(masterSequence.sequenceControllers[q] === targetSequence) {
          masterSequence.requestModifySequenceTime(masterSequence.sequenceControllers[q], source.priority, source.node.name, timeModifier);
        }
      }
    }
  }

}