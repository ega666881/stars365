import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';

class SpinStore {
  duration = 1

  constructor() {
    makeAutoObservable(this);
  }

  addDuration = action(() => {
    this.duration += 1
  })

}

const spinStore = new SpinStore();

export default spinStore;
