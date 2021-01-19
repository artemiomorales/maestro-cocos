import { AppSettings } from './appSettings';
import { TouchMonitor } from './touchMonitor';
import { _decorator, Component, systemEvent, SystemEvent, AnimationComponent, Touch, log, Node, AnimationState, AnimationClip } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SequenceController')
export class SequenceController extends Component {

    @property({type:Node})
    public touchMonitorObject: Node = null;

    private touchMonitor: TouchMonitor = null;

    @property({type:AnimationComponent})
    public targetAnimation: AnimationComponent = new AnimationComponent();

    private defaultClip: AnimationClip = new AnimationClip();
    private animState: AnimationState = new AnimationState(new AnimationClip(), "none");

    onEnable () {
        this.touchMonitorObject.on('onSwipe', this._updateSequenceWithSwipe, this);
        this.touchMonitorObject.on('onMomentum', this._updateSequenceWithMomentum, this);
    }

    onDisable () {
        this.touchMonitorObject.off('onSwipe', this._updateSequenceWithSwipe, this);
        this.touchMonitorObject.off('onMomentum', this._updateSequenceWithMomentum, this);
    }

    start() {
      this.touchMonitor = this.touchMonitorObject.getComponent("TouchMonitor") as TouchMonitor;
      if(this.targetAnimation.defaultClip !== null) {
        this.defaultClip = this.targetAnimation.defaultClip;
        this.targetAnimation.play(this.defaultClip.name);
        this.animState = this.targetAnimation.getState(this.defaultClip.name);
        this.animState.speed = 0;
      }
    }

    _updateSequenceWithSwipe() {
      this._modifySequence(this.touchMonitor.swipeForce.y);
    }

    _updateSequenceWithMomentum() {
      this._modifySequence(this.touchMonitor.touchMonitorMomentum.y);
    }

    _modifySequence(modifier: number) {
      const newTime = this.animState.time + modifier;

      if(newTime < 0) {
        this.animState.time = 0;
      }

      else if(newTime > this.defaultClip.duration) {
        this.animState.time = this.defaultClip.duration;
      }

      else {
        this.animState.time = newTime;
      }

    }
}
