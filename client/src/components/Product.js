import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewRow from './ReviewRow';
import PartRow from './PartRow';
import SimilarSetButton from './SimilarSetButton';
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
      
      set: [],
      reviews: [],
      parts: [],
      similarSets: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log(this.props);
    var set_num = this.state.set_num;
    this.findSet(set_num);
    this.showReviews(set_num);
    this.showParts(set_num);
    this.showSimilarSets(set_num);
    var btns = document.querySelectorAll(".dropdown");
    for (var i = 0, len = btns.length; i < len; i++) {
      btns[i].addEventListener("click", this.toggle_visibility);
    }

  }

  toggle_visibility(e) {
  var content = e.target.nextElementSibling;
  if (content.getAttribute("data-state") === "closed") {
      content.setAttribute("data-state", "open");
      e.target.setAttribute("data-toggle", "on");
    }
  else {
      content.setAttribute("data-state", "closed");
      e.target.setAttribute("data-toggle", "off");
    }
  }

  findSet(set_num){
    fetch("http://localhost:8081/product/" + this.state.set_num,
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(setList => {
      if (!setList) return;
      let setDivs = setList.map((setObj, i) =>
      <div className="set" id={setObj.set_num}>
				<div className="name">{setObj.name}</div>
        <div className="year">Year: {setObj.year}</div>
        <div className="year">Number of Parts: {setObj.num_parts}</div>
        <div className="frame">
          <img src={setObj.image_url} alt="centered image" className="image" />
        </div>
			</div>
      );
      this.setState({
        
        set: setDivs
      });
      console.log(this.state.set);
    }, err => {
      console.log(err);
    });
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
        reviews_open : !this.state.reviews_open,
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
        parts: partDivs,
        parts_open : !this.state.parts_open
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
        similarSets_open : !this.state.similarSets_open,
        similarSets: setDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showSets(set_num) {
    window.location.href = "/product?set_num="+set_num
  }

  render() {    
    return (
      <div className="Product">
        <br></br>
        <PageNavbar />
        <div className="searchContainer">
          {this.state.set}
        </div>     
        <br></br>
        <br></br>
          <div class = "PartContent">
            <button id="dropdown" class="dropdown" data-toggle="off">Show All Parts</button>
            <div id="dropdowncontent" class="content" data-state="closed">
            {this.state.parts}           
            </div>
          </div>
        
          <div class = "SimilarSetContent">
            <button id="dropdown" class="dropdown" data-toggle="off">Show Similar Sets</button>
            <div id="dropdowncontent" class="content" data-state="closed">
            {this.state.similarSets} 
            </div>
          </div>
         

          <div class = "ReviewContent">
            <button id="dropdown" class="dropdown" data-toggle="off">Show All Reviews</button>
            <div id="dropdown" class="content" data-state="closed">
              {this.state.reviews}
            </div>
          </div>  

          <br></br>
          <br></br>
          <br></br>
 
      </div>
 
    );
  }
}