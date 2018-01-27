import { h, Component } from "preact";
import randomColor from "randomcolor";
import { connect } from "./store";
import actions from "./actions";
import { getBreeds, getImages, getImagesConcurrently } from "./api";
import * as P from "polished";
import {
  LetterButton,
  Nav,
  ArrowButtons,
  Arrow,
  Main,
  Pic,
  LoadingSpinner,
  SourceLink
} from "./components";

/***********  FUTURES DEMO  *************/

// Why Futures      versus       promises?
//     -------                   ---------
//     lazy                      eager
//     cancellable               not cancellable
//     not cached                cached          (you may make Futures stateful by wrapping it in a caching helper)
//     enforced error handling   optional error handling
//     catch expected errors     catch all errors

// look at api.js to see the Futures
// To see the effection fo cancellation, comment out the this.cancel() code below
// and checkout the network tab when clicking around

class App extends Component {
  componentDidMount() {
    this.props.getBreeds();
    this.loadImages = this.loadImages.bind(this);
  }

  componentWillReceiveProps({ imagesIndex: nextIndex, breeds }) {
    if (nextIndex === null && breeds.length > 0) {
      // default to 'a' in breeds list
      this.props.setImagesIndex(0);
    }
    if (this.props.imagesIndex !== nextIndex) {
      // load new images
      // In case there is an unresolved Future, cancel
      if (this.cancel) {
        this.cancel()
        this.props.setLoading(false)
      }
      this.loadImages(nextIndex);
    }
  }

  loadImages(nextIndex) {
    this.props.setLoading(true)
    const { breeds } = this.props;
    const ids = breeds[nextIndex];
    // future executed when fork is called
    this.cancel = getImagesConcurrently(ids).fork(
      // rejection branch
      err => {
        console.log(err)
        this.props.setLoading(false)
      },
      // success branch
      res => {
        this.props.setImages(res)
        this.props.setLoading(false)
      });
  }

  render({
    letters,
    color,
    imagesIndex,
    toggleColor,
    getImages,
    decrementIndex,
    incrementIndex,
    setImagesIndex,
    images,
    breeds,
    loading
  }) {
    // Change background so we see each rerender
    const superColor = randomColor({ luminosity: "light" });
    return (
      <div style={{ backgroundColor: P.lighten(0.1, superColor), height: '180vh', padding: '10px' }}>
        <Nav>
          {letters.map((letter, i) => (
            <LetterButton
              key={i}
              data-images-index={i}
              color={superColor}
              onClick={e =>
                setImagesIndex(
                  Number(e.target.getAttribute("data-images-index"))
                )}
              active={i === imagesIndex}
            >
              {letter}
            </LetterButton>
          ))}
        </Nav>
        <ArrowButtons>
          <Arrow onClick={decrementIndex}>&#8592;</Arrow>
          <Arrow onClick={incrementIndex}>&#8594;</Arrow>
        </ArrowButtons>
        <Main>
          {!loading ? images.map((src, i) => (
            <Pic src={src} key={src} name={breeds[imagesIndex][i]} />
          )) : <LoadingSpinner color={superColor} />}
        </Main>
        <SourceLink color={superColor} />
      </div>
    );
  }
}

export default connect("imagesIndex,letters,images,breeds,loading", actions)(App);
