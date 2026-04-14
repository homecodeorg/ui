import { createStore } from 'justorm/react';
import Time from 'timen';

const getRandomDegree = () => Math.random() * 360;
let clearGradientTimeout;

const STORE = createStore('app', {
  isMenuOpen: false,
  gradient: {
    prev: [getRandomDegree(), getRandomDegree(), getRandomDegree()],
    curr: [getRandomDegree(), getRandomDegree(), getRandomDegree()],
    changeCount: 0,
  },

  updateGradient() {
    clearGradientTimeout?.();
    clearGradientTimeout = Time.after(5000, STORE.updateGradient);

    const gr = STORE.gradient;

    STORE.gradient = {
      prev: [...gr.curr],
      curr: [getRandomDegree(), getRandomDegree(), getRandomDegree()],
      changeCount: gr.changeCount + 1,
    };
  },

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  },
});

export default STORE;
