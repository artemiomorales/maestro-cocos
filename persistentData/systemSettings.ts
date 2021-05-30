
import { _decorator, Component, Node, v2, Vec2, Vec3, CCFloat } from 'cc';
import { BoolVariable } from './boolVariable';
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
  private _menuRequested: BoolVariable = new BoolVariable();
  public get menuRequested() {
    return this._menuRequested;
  }
  public set menuRequested(value: BoolVariable) {
    this._menuRequested = value;
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
    this.variableMap[this.menuRequested.variableKey.name] = this.menuRequested;
  }
}