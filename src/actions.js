import {getBreeds} from './api'

const actions = store => ({
  toggleColor(state, color) {
    return Object.assign(color, { color });
  },
  setImagesIndex(state, imagesIndex) {
    return Object.assign(state, { imagesIndex });
  },
  incrementIndex(state, imagesIndex) {
    if (state.imagesIndex < state.letters.length - 1) {
      return Object.assign(state, { imagesIndex: state.imagesIndex + 1 });
    }
    return state;
  },
  decrementIndex(state, imagesIndex) {
    if (state.imagesIndex > 0) {
      return Object.assign(state, { imagesIndex: state.imagesIndex - 1 });
    }
    return state;
  },
  getBreeds(state) {
    getBreeds.fork(
      err => console.log(err),
      data => store.setState({ breeds: data.breeds, letters: data.letters })
    );
  },
  setImages(state, images) {
    return Object.assign(state, { images });
  },
  setLoading(state, isLoading) {
    return Object.assign(state, {loading: isLoading})
  }
});

export default actions;