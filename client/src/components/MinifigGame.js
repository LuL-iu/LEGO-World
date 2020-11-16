import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/MinifigGame.css';


// Helper function to remove unnecessary text from minifig name 
function cleanMinifigName(name) {
  let sep = ',';
  name = name.split(sep, 1)[0];
  sep = ' in ';
  name = name.split(sep, 1)[0];
  sep = ' with ';
  name = name.split(sep, 1)[0];
  name = name.replace('Professor', '');
  name = name.trim();

  return name;
}

// Helper function to shuffle an array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export default class MinifigGame extends React.Component {
  constructor(props) {
    super(props);

    this.movieList = ['Harry Potter', 'Star Wars', 'Indiana Jones', 'Jurassic World', 'Pirates of the Caribbean'];
    
    this.state = {
      selectedMovie: "",
      movies: [],
			minifigActors: [],
      minifigActorIndex: 0,
      guessingCharacter: true,
      currActorOptions: [],
      currCharacterOptions: [],
      currImageUrl: "",
      feedback: ""
		};

    this.onMovieSubmit = this.onMovieSubmit.bind(this);
    this.handleMovieChange = this.handleMovieChange.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    this.onAnswerSubmit = this.onAnswerSubmit.bind(this);
    this.nextImage = this.nextImage.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    let movieOptions = this.movieList.map((movie, i) =>
		  <option value={movie}> {movie} </option> 
    );
    
    this.setState({
      movies: movieOptions
    });
  }

  handleMovieChange(e) {
		this.setState({
      selectedMovie: e.target.value,
      guessingCharacter: true
		});
	}

  onMovieSubmit() {
    fetch(`http://localhost:8081/minifig-actor/${this.state.selectedMovie}`,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(minifigActorList => {
      if (!minifigActorList) return;

      this.setState({
        minifigActors: minifigActorList,
        minifigActorIndex: 0,
        currImageUrl: minifigActorList[0].image_url
      }, () => this.createAnswerOptions());

    }, err => {
      console.log(err)
    });
  }

  createAnswerOptions() {
    let minifigs = this.state.minifigActors;
    let correct = minifigs[this.state.minifigActorIndex];
    correct.minifig_name = cleanMinifigName(correct.minifig_name);

    let characterOptions = [correct.minifig_name];
    let actorOptions = [correct.actor_name];

    while(characterOptions.length < 3) {
      let temp = minifigs[Math.floor(Math.random()*minifigs.length)];
      if (!characterOptions.includes(cleanMinifigName(temp.minifig_name))) {
        characterOptions.push(cleanMinifigName(temp.minifig_name));
      }
    } 

    while(actorOptions.length < 3) {
      let temp = minifigs[Math.floor(Math.random()*minifigs.length)];
      if (!actorOptions.includes(temp.actor_name)) {
        actorOptions.push(temp.actor_name);
      }
    }

    actorOptions = [
      {text: actorOptions[0], isCorrect: true},
      {text: actorOptions[1], isCorrect: false},
      {text: actorOptions[2], isCorrect: false}
    ];

    shuffle(actorOptions);

    characterOptions = [
      {text: characterOptions[0], isCorrect: true},
      {text: characterOptions[1], isCorrect: false},
      {text: characterOptions[2], isCorrect: false}
    ]

    shuffle(characterOptions);

    this.setState({
      currActorOptions: actorOptions,
      currCharacterOptions: characterOptions
    })
  }

  nextImage() {
    let new_index = this.state.minifigActorIndex + 1;
    let new_image_url = this.state.minifigActors[new_index].image_url;
    this.setState({
      minifigActorIndex: new_index,
      currImageUrl: new_image_url,
      feedback: ""
    }, () => this.createAnswerOptions())
  }

  onAnswerSubmit(event){
    event.preventDefault();
    let answerOption;
    if (this.state.guessingCharacter) {
      for (let i = 0; i < this.state.currCharacterOptions.length; i++) {
        if (this.state.currCharacterOptions[i].text === this.state.selectedAnswer) {
          answerOption = this.state.currCharacterOptions[i];
        }
      }

      if (answerOption.isCorrect) {
        this.setState({
          guessingCharacter: false
        });
      } else {
        this.setState({
          feedback: "WRONG!",
        });
      }
    } else {
      for (let i = 0; i < this.state.currActorOptions.length; i++) {
        if (this.state.currActorOptions[i].text === this.state.selectedAnswer) {
          answerOption = this.state.currActorOptions[i];
        }
      }
      if (answerOption.isCorrect) {
        this.setState({
          guessingCharacter: true,
          minifigActorIndex: this.state.minifigActorIndex + 1
        }, () => this.nextImage());
      } else {
        this.setState({
          feedback: "WRONG!",
        });
      }
    }
  }

  onAnswerChange(event) {
    this.setState({
      selectedAnswer: event.target.value
    });
  }


  render() {
    let choices;
    let prompt;
    if (this.state.guessingCharacter) {
      choices = this.state.currCharacterOptions.map((charObj, i) => {
        return ( 
          <div className="radio"> 
            <label>
              <input
                type="radio"
                value={charObj.text}
                checked={this.state.selectedAnswer === charObj.text}
                onChange={this.onAnswerChange} 
              />
              {charObj.text}
            </label>
          </div>  );
      });
      prompt = "Pick the character!"
    } else {
      choices = this.state.currActorOptions.map((actObj, i) => {
        return ( 
          <div className="radio"> 
            <label>
              <input
                type="radio"
                value={actObj.text}
                checked={this.state.selectedAnswer === actObj.text}
                onChange={this.onAnswerChange} 
              />
              {actObj.text}
            </label>
          </div>  );
      });
      prompt = "Pick the actor/actress!"
    }

    return (
      <div>
        <div className="dropdown-container">
          <select value={this.state.selectedMovie} onChange={this.handleMovieChange} className="dropdown" id="moviesDropdown">
            <option select value> -- select a movie -- </option>
            {this.state.movies}
          </select>
          <button className="submit-btn" id="moviesSubmitBtn" onClick={this.onMovieSubmit}>PLAY!</button>
        </div>
        <div>
          <img 
            src={this.state.currImageUrl}
            alt="minifig"  
          />
        </div>
        <div>
          {prompt}
          <form onSubmit={this.onAnswerSubmit}>
            {choices}
            <div>
              {this.state.feedback}
            </div>
            <button className="btn btn-default" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}