
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

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_SCENE_LOAD], (complexPayload: ComplexPayload) => {
      this.triggerSceneLoad(complexPayload);
    })

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_TO_BLACK_COMPLETED], () => {
      this.fadeToBlackCompletedCallback();
    })
  }

  triggerSceneLoad(complexPayload: ComplexPayload) {
    this.targetScene = complexPayload.get(this.triggerSceneLoadKey.name);
    
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
    this.sceneLoadCompletedCallback = complexPayload.get(this.eventCallbackKey.name);

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

    director.loadScene(this.targetScene, () => {
      // Now that we're faded to black, determine which event
      // we'll send to the fader as our final callback
      if(this.sceneLoadCompletedCallback && this.sceneLoadCompletedCallback !== "") {
        this.appSettings.triggerSimpleEvent(this.node, this.sceneLoadCompletedCallback);
      } else {
        this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED])
      }
    });

  }

}