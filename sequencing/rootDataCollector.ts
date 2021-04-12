
import { _decorator, Component, Node } from 'cc';
import { RootConfig } from './rootConfig';
const { ccclass, property } = _decorator;

@ccclass('RootDataCollector')
export class RootDataCollector extends Component {
 
  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }

  public get masterSequences() {
    return this._rootConfig.masterSequences;
  }

  configureData() { }
}