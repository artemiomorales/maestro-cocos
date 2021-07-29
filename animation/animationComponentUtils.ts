
import { _decorator, Component, Node, AnimationComponent, AnimationState, ButtonComponent, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationComponentUtils')
export class AnimationComponentUtils extends Component {
    
  private _animationComponent: AnimationComponent = null!;
  public get animationComponent() {
    return this._animationComponent;
  }
  public set animationComponent(value: AnimationComponent) {
    this._animationComponent = value;
  }

  @property({type: [EventHandler], visible: true})
  private _onFinishedEvents: EventHandler[] = [];
  public get onFinishedEvents() {
    return this._onFinishedEvents;
  }
  public set onFinishedEvents(value: EventHandler[]) {
    this._onFinishedEvents = value;
  }

  start() {
    if(!this.animationComponent) {
      this.animationComponent = this.node.getComponent(AnimationComponent) as AnimationComponent;
    }

    this.animationComponent.on("finished", this.onFinished, this);
  }

  playDefaultClipIfStopped() {
    if(this.animationComponent.getState(this.animationComponent.defaultClip?.name as string).isPlaying === false) {
      this.animationComponent.play();
    }
  }

  setToBeginning() {
    const state = this.animationComponent.getState(this.animationComponent.defaultClip?.name as string);
    state.setTime(0);
  }

  setToEnd() {
    const state = this.animationComponent.getState(this.animationComponent.defaultClip?.name as string);
    state.setTime(this.animationComponent.defaultClip?.duration as number);
  }

  onFinished (type: any, state: any) {
    EventHandler.emitEvents(this.onFinishedEvents);
  }


}
