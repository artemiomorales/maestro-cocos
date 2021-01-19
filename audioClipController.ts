import { _decorator, Component, Node, AudioSourceComponent } from 'cc';
import { TouchMonitor } from './touchMonitor';
const { ccclass, property } = _decorator;

@ccclass('AudioClipController')
export class AudioClipController extends Component {
    
    @property({type:Node})
    public touchMonitorObject: Node = null;

    private touchMonitor: TouchMonitor = null;

    private audioSource: AudioSourceComponent = null;

    onEnable () {
      this.touchMonitorObject.on('onSwipe', this.playAudio, this);
    }

    onDisable () {
      this.touchMonitorObject.off('onSwipe', this.playAudio, this);
    }

    start () {
      this.audioSource = this.getComponent("cc.AudioSource") as AudioSourceComponent;
    }

    playAudio() {
      this.audioSource.play();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
