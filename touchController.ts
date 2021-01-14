import { _decorator, Component, systemEvent, SystemEvent, AnimationComponent, Touch, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchController')
export class TouchController extends Component {

    private _pressedX = 0;
    private _pressedY = 0;

    public anim: any = null;
    public animState: any = null;
    public currentTime: number = 0;

    start () {
      this.anim = this.getComponent(AnimationComponent);
      this.anim.play('text');
      this.animState = this.anim.getState('text');
      this.animState.speed = 0;
    }

    onLoad () {
      systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
      systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onViewTouchMove, this);
      // systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onViewTouchEnd, this);
    }

    onViewTouchStart(event: Touch) {
        let location = event.getLocation();// 获取节点坐标
        this._pressedX = location.x;
        this._pressedY = location.y;
    }

    onViewTouchMove(event: Touch) {
        let touchPoint = event.getLocation();
        let deltaX = this._pressedX - touchPoint.x;
        let deltaY = this._pressedY - touchPoint.y;
    
        // log(deltaX);
        // log(deltaY);
        // log(this);

        // accelerate the playing speed of animation
        // this.animState.speed = 0;
        
        if (deltaY > 0){
            this.animState.time = (this.animState.time - .01);
        } else {
            // up
            this.animState.time = (this.animState.time + .01);
        }
      
    
    }


    onDestroy() {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onViewTouchMove, this);
    }
}
