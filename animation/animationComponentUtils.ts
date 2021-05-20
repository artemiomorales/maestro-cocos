
import { _decorator, Component, Node, AnimationComponent, AnimationState, ButtonComponent, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationComponentUtils')
export class AnimationComponentUtils extends Component {
    
  @property({type: AnimationComponent, visible: true})
  private _animationComponent: AnimationComponent = null!;
  public get animationComponent() {
    return this._animationComponent;
  }
  public set animationComponent(value: AnimationComponent) {
    this._animationComponent = value;
  }

  @property({type: [EventHandler], visible: true})
  private _events: EventHandler[] = [];
  public get events() {
    return this._events;
  }
  public set events(value: EventHandler[]) {
    this._events = value;
  }

  start () {
    if(!this.animationComponent) {
      this.animationComponent = this.node.getComponent(AnimationComponent) as AnimationComponent;
    }

    this.animationComponent.on("finished", this.onFinished, this);
  }

  onFinished (type: any, state: any) {
    EventHandler.emitEvents(this.events);
  }

}
