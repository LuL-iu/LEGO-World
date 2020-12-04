import React from 'react';
import '../style/Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SetButton from './SetButton';
import MinifigButton from './MinifigButton';



export default class Search extends React.Component {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      searchTerm: urlParams.get('text'),
      sets: [],
      miniFigs: []
    }
  }

  componentDidMount() {
    this.findSet();
    this.findMiniFig();

  }
  
  findSet(){
    fetch("http://localhost:8081/search/set/" + this.state.searchTerm,
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(objList => {
      if (!objList) return;
      let objDivs = objList.map((setObj, i) =>
      <SetButton id={"button-" + setObj.name} onClick={() => this.showSet(setObj.set_num)}  num_parts = {setObj.num_parts}  name ={setObj.name} year={setObj.year} url={setObj.image_url}/>
      );
      this.setState({
        sets: objDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showSet(set_num) {
    window.location.href = "/product?set_num="+ set_num 
  }

  findMiniFig(){
    fetch("http://localhost:8081/search/minifig/" + this.state.searchTerm,
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(objList => {
      if (!objList) return;
      let objDivs = objList.map((figObj, i) =>
      <MinifigButton id={"button-" + figObj.name} onClick={() => this.showMiniFig(figObj.num)} num_parts = {figObj.num_parts} fig_num ={figObj.fig_num} name ={figObj.name} url={figObj.image_url}/>
      );
      this.setState({
        miniFigs: objDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showMiniFig(fig_num) {
    
  }
  
  render() {    
    return (
      <div className="Sets">
        <br></br>
        <PageNavbar/>
  
        <br></br>
        <div className="container">
            <div className="h5">Search Result</div>
            <div className="searchTitle">Sets</div>
            <div className="sets-container-search">
              {this.state.sets}
            </div>
            <br></br>
            <div className="searchTitle">Mini Figures</div>
            <div className="sets-container-search">
              {this.state.miniFigs}
            </div>
        
        </div>

      </div>
    );
  }
}