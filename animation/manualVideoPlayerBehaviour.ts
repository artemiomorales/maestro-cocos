
import { _decorator, Component, Node, VideoPlayer, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ManualVideoPlayer')
export default class ManualVideoPlayerBehaviour extends Component {

  @property({type: VideoPlayer, visible: true})
  private _videoPlayer: VideoPlayer = null!;
  public get videoPlayer() {
    return this._videoPlayer;
  }
  public set videoPlayer(value: VideoPlayer) {
    this._videoPlayer = value;
  }

  @property({type: CCFloat, visible: true})
  private _currentTime: number = 0;
  public get currentTime() {
    return this._currentTime;
  }
  public set currentTime(value: number) {
    this._currentTime = value;
  }

  start() {
    if(!this.videoPlayer) {
      this.videoPlayer = this.node.getComponent(VideoPlayer) as VideoPlayer;
    }
    this.videoPlayer.playbackRate = 0;
    this.videoPlayer.play();
  }

  update () {
    this.videoPlayer.currentTime = this.currentTime;
  }

}