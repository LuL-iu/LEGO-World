import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewRow from './ReviewRow';
import '../style/Product.css';
import PageNavbar from './PageNavbar';
export default class product extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      name : "",
      year: "",
      url: "",
      reviews: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const set_num = urlParams.get('param1')
    const name = urlParams.get('param2')
    const year = urlParams.get('param3')
    const url = urlParams.get('param4')
    if(set_num == '') set_num = '8479-1'
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/product/" + set_num,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(reviewList => {
      if (!reviewList) return;
      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let reviewDivs = reviewList.map((setObj, i) =>
      <ReviewRow id={"review-" + setObj.set_num} overall ={setObj.overall} review= {setObj.review} title={setObj.title} author={setObj.author} date={setObj.date}/>
      );
      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        reviews: reviewDivs,
        name: name,
        year: year,
        url: url
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  render() {    
    return (
      <div className="Product">
        <PageNavbar active="product" />
        <div className="container review-container">
          <div className="container setinfo-container">
            <div className="jumbotron">
              <div className="h5">LEGO SET</div>
              <div className="name">{this.state.name}</div>
              <div className="year">{this.state.year}</div>
              <div className="theme">{this.state.theme}</div>
              <div class="frame">
                <img src={this.state.url} alt="centered image" className="image" />
              </div>
            </div>
          </div>

          <br></br>
          <div className="container review-container">
            <div className="jumbotron">
              <div className="h5">Reviews</div>
              <div className="review-container">
                {this.state.reviews}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}