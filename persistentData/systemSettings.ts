
import { TextAsset, _decorator } from 'cc';
import { BoolVariable } from './boolVariable';
import { FloatVariable } from './floatVariable';
import { StringReference } from './stringReference';
const { ccclass, property } = _decorator;

@ccclass('SystemSettings')
export default class SystemSettings {

  @property({visible: true})
  private _appUtilsRequested: BoolVariable = new BoolVariable();
  public get appUtilsRequested() {
    return this._appUtilsRequested;
  }
  public set appUtilsRequested(value: BoolVariable) {
    this._appUtilsRequested = value;
  }

  @property({visible: true})
  private _progressBarVisible: BoolVariable = new BoolVariable();
  public get progressBarVisible() {
    return this._progressBarVisible;
  }
  public set progressBarVisible(value: BoolVariable) {
    this._progressBarVisible = value;
  }

  @property({visible: true})
  private _sceneLoadingProgress: FloatVariable = new FloatVariable();
  public get sceneLoadingProgress() {
    return this._sceneLoadingProgress;
  }
  public set sceneLoadingProgress(value: FloatVariable) {
    this._sceneLoadingProgress = value;
  }

  @property({visible: true})
  private _menuRequested: BoolVariable = new BoolVariable();
  public get menuRequested() {
    return this._menuRequested;
  }
  public set menuRequested(value: BoolVariable) {
    this._menuRequested = value;
  }

  @property({type: StringReference, visible: true})
  private _yNorthKey: StringReference = null!;
  public get yNorthKey() {
    return this._yNorthKey;
  }
  public set yNorthKey(value: StringReference) {
    this._yNorthKey = value;
  }

  @property({type: StringReference, visible: true})
  private _ySouthKey: StringReference = null!;
  public get ySouthKey() {
    return this._ySouthKey;
  }
  public set ySouthKey(value: StringReference) {
    this._ySouthKey = value;
  }

  @property({type: StringReference, visible: true})
  private _xEastKey: StringReference = null!;
  public get xEastKey() {
    return this._xEastKey;
  }
  public set xEastKey(value: StringReference) {
    this._xEastKey = value;
  }

  @property({type: StringReference, visible: true})
  private _xWestKey: StringReference = null!;
  public get xWestKey() {
    return this._xWestKey;
  }
  public set xWestKey(value: StringReference) {
    this._xWestKey = value;
  }

  private _touchBranchKeys: TextAsset[] = [];
  public get touchBranchKeys() {
    return this._touchBranchKeys;
  }
  public set touchBranchKeys(value: TextAsset[]) {
    this._touchBranchKeys = value;
  }

  private _variableMap: any = {};
  public get variableMap() {
    return this._variableMap;
  }
  public set variableMap(value: any) {
    this._variableMap = value;
  }
  
  initialize() {
    this.variableMap[this.appUtilsRequested.variableKey.name] = this.appUtilsRequested;
    this.variableMap[this.progressBarVisible.variableKey.name] = this.progressBarVisible;
    this.variableMap[this.menuRequested.variableKey.name] = this.menuRequested;
    this.variableMap[this.yNorthKey.variableReference.name] = this.yNorthKey;
    this.variableMap[this.ySouthKey.variableReference.name] = this.ySouthKey;
    this.variableMap[this.xWestKey.variableReference.name] = this.xWestKey;
    this.variableMap[this.xEastKey.variableReference.name] = this.xEastKey;

    this.touchBranchKeys.push(this.yNorthKey.variableReference);
    this.touchBranchKeys.push(this.ySouthKey.variableReference);
    this.touchBranchKeys.push(this.xEastKey.variableReference);
    this.touchBranchKeys.push(this.xWestKey.variableReference);
  }
}