
import { _decorator, Component, Node, find, director, TextAsset, CCString } from 'cc';
import AppSettings from '../persistentData/appSettings';
import { CONSTANTS, COMPLEX_EVENT, SIMPLE_EVENT } from '../constants';
import ComplexPayload from '../complexPayload';
const { ccclass, property } = _decorator;

@ccclass('SceneController')
export class SceneController extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: TextAsset, visible: true})
  private _triggerSceneLoadKey: TextAsset = null!;

  public get triggerSceneLoadKey() {
    return this._triggerSceneLoadKey;
  }
  public set triggerSceneLoadKey(value: TextAsset) {
    this._triggerSceneLoadKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _eventCallbackKey: TextAsset = null!;

  public get eventCallbackKey() {
    return this._eventCallbackKey;
  }
  public set eventCallbackKey(value: TextAsset) {
    this._eventCallbackKey = value;
  }

  @property({visible: true, readonly: true})
  private _sceneLoadCompletedCallback: string | null = "";

  public get sceneLoadCompletedCallback() {
    return this._sceneLoadCompletedCallback;
  }
  public set sceneLoadCompletedCallback(value: string | null) {
    this._sceneLoadCompletedCallback = value;
  }

  @property({visible: true, readonly: true})
  private _targetScene: string = "";
  public get targetScene() {
    return this._targetScene;
  }
  public set targetScene(value: string) {
    this._targetScene = value;
  }

  private _sceneLoadInProgress: boolean = false;
  public get sceneLoadInProgress() {
    return this._sceneLoadInProgress;
  }
  public set sceneLoadInProgress(value: boolean) {
    this._sceneLoadInProgress = value;
  }

  public get loadingProgress() {
    return this.appSettings.getSceneLoadingProgress(this.node);
  }

  public set loadingProgress(value: number) {
    this.appSettings.setSceneLoadingProgress(this.node, value);
  }


  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
    
    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_SCENE_LOAD], this.triggerSceneLoad, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED], this.fadeToBlackCompletedCallback, this)
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_SCENE_LOAD], this.triggerSceneLoad, this);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED], this.fadeToBlackCompletedCallback, this)
  }

  triggerSceneLoad(complexPayload: ComplexPayload) {

    // This is to prevent the scene controller failing silently in case you
    // accidentally trigger two scene loads at once
    if(this.sceneLoadInProgress) {
      throw "You are trying to trigger two scene loads at once; this is not allowed";
    }

    this.targetScene = complexPayload.get(this.node, this.triggerSceneLoadKey.name);
    this.sceneLoadInProgress = true;
    
    // TO DO
    // Add option for loading scene immediately

    this.performComplexSceneLoad(complexPayload);
  }

  /// <summary>
  /// Work in conjunction with the fader to fade to black, perform a scene
  /// load, perform a fade in, and when the animation is complete, execute a
  /// simple event callback
  /// </summary>
  /// <param name="complexPayload"></param>
  performComplexSceneLoad (complexPayload: ComplexPayload) {

    // Store the callback so we can retrieve it once the fadeToBlack animation is complete
    // (Note: the callback may be null at this point - we'll check later when it's time to use it)
    this.sceneLoadCompletedCallback = complexPayload.get(this.node, this.eventCallbackKey.name);

    // Modify the complex payload, inserting a callback that we can
    // use to respond when the fadeToBlack animation is complete
    complexPayload.set(this.eventCallbackKey.name, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED])

    // Pass on the rest of the payload parameters to the fader
    this.appSettings.triggerComplexEvent(this.node, Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_FADE_TO_BLACK], complexPayload);
  }

  /// <summary>
  /// Once the fade to black is completed, repopulate our
  /// complex payload with our final callback, perform the scene load,
  /// and once the scene load is complete, send a fade in request
  /// along with our complex payload parameters
  /// </summary>
  fadeToBlackCompletedCallback() {
    director.preloadScene(this.targetScene,
      (completedCount: number, totalCount: number, item: any) => {
        const percentComplete = completedCount / totalCount;
        this.loadingProgress = percentComplete;
      }, 
      () => {
        director.loadScene(this.targetScene, () => {
          this.sceneLoadInProgress = false;
          // Now that we're faded to black, determine which event
          // we'll send to the fader as our final callback
          if(this.sceneLoadCompletedCallback && this.sceneLoadCompletedCallback !== "") {
            this.appSettings.triggerSimpleEvent(this.node, this.sceneLoadCompletedCallback);
          } else {
            this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED])
          }
        });
    });

  }

}