
import InputModule from '../inputModule';
import TouchController from './touchController';

export default interface TouchModule extends InputModule {
  touchController: TouchController;
}
