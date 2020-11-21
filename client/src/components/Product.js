import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewRow from './ReviewRow';
import ReviewButton from './ReviewButton';
import PartRow from './PartRow';
import PartButton from './PartButton';
import SimilarSetButton from './SimilarSetButton';
import SimilarButton from './SimilarButton';
import '../style/Product.css';
import PageNavbar from './PageNavbar';
export default class product extends React.Component {

  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      set_num : urlParams.get('set_num'),
      name : urlParams.get('name'),
      year : urlParams.get('year'),
      url : urlParams.get('url'),
      reviews: [],
      parts: [],
      similarSets: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
  }

  showReviews(set_num) {
    fetch("http://localhost:8081/product/reviews/" + this.state.set_num,
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(reviewList => {
      if (!reviewList) return;
      let reviewDivs = reviewList.map((setObj, i) =>
      <ReviewRow overall ={setObj.overall} review= {setObj.review} title={setObj.title} author={setObj.author} date={setObj.date}/>
      );
      this.setState({
        reviews: reviewDivs
      });
      console.log(this.state.reviews);
    }, err => {
      console.log(err);
    });
  }

  showParts(set_num) {
    fetch("http://localhost:8081/product/parts/" + this.state.set_num,
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(partList => {
      if (!partList) return;
      let partDivs = partList.map((partObj, i) =>
      <PartRow id={"parts-" + partObj.part_num} quantity ={partObj.quantity} url= {partObj.image_url} name={partObj.name}/>
      );
      this.setState({
        parts: partDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showSimilarSets(set_num) {
    fetch("http://localhost:8081/product/similarSet/" + this.state.set_num,
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(setList => {
      if (!setList) return;
      let setDivs = setList.map((setObj, i) =>
      <SimilarSetButton id={"button-" + setObj.name} onClick={() => this.showSets(setObj.set_num, setObj.name, 
      setObj.year, setObj.url)} name ={setObj.name} sameParts = {setObj.sameParts} similarity = {setObj.similarity} year={setObj.year} url={setObj.url}/>
      );
      this.setState({
        similarSets: setDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showSets(set_num, name, year, url) {
    window.location.href = "/product?set_num="+set_num+"&name="+name +"&year=" + year + "&url=" + url 
  }

  render() {    
    return (
      <div className="Product">
        <PageNavbar active="product" />
   
        <div className="container setinfo-container">
          <div className="jumbotron">
            <div className="name">{this.state.name}</div>
            <div className="year">{this.state.year}</div>
            <div className="theme">{this.state.theme}</div>
            <div className="frame">
              <img src={this.state.url} alt="centered image" className="image" />
            </div>
          </div>
        </div>

        <br></br>
        <div className="container section-container">
          <div className="jumbotron">
            <div className = "part">
              <PartButton id={"button-" + this.state.set_num} onClick={() => this.showParts(this.set_num)}></PartButton>
              <div className="part-container">
                {this.state.parts}
              </div>
            </div>
          </div>
        </div>

        <br></br>
        <div className="container section-container">
          <div className="jumbotron">
            <div className = "review">
              <ReviewButton id={"button-" + this.state.set_num} onClick={() => this.showReviews(this.set_num)}></ReviewButton>
              <div className="review-container">
                {this.state.reviews}
              </div>
            </div>
          </div>
        </div>

        <br></br>
        <div className="container section-container">
          <div className="jumbotron">
            <div className = "set">
              <SimilarButton id={"button-" + this.state.set_num} onClick={() => this.showSimilarSets(this.set_num)}></SimilarButton>
              <div className="set-container">
                {this.state.similarSets}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}