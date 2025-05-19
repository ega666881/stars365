import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';

class IntroductionStore {
  currentPage = 1
  pages = {
    1: <OnePage />,
    2: <TwoPage />
  }

  constructor() {
    makeAutoObservable(this);
  }

  getPage = action(() => {
    return this.pages[this.currentPage]
  })

  nextPage = action(() => {
    if (this.currentPage < 2) {
      this.currentPage += 1
    }
    
  })

  prevPage = action(() => {
    this.currentPage -= 1
  })

}

const introductionStore = new IntroductionStore();

export default introductionStore;
