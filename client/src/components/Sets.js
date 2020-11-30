import React from 'react';
import '../style/Sets.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SetButton from './SetButton';


export default class Sets extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      sets: []
    }

    // this.showSets = this.showSets.bind(this);
  }

  componentDidMount() {
    const { themeId } = this.props.match.params;
    
    fetch("http://localhost:8081/sets/" + themeId,
    {
      method: 'GET' 
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(setList => {
      if (!setList) return;
      let setDivs = setList.map((setObj, i) =>
      <SetButton id={"button-" + setObj.name} onClick={() => this.showSets(setObj.set_num, setObj.name, setObj.year, setObj.image_url)} name ={setObj.name} year={setObj.year} url={setObj.image_url}/>
      );
      this.setState({
        sets: setDivs
      });
    }, err => {
      console.log(err);
    });
  }

  showSets(set_num, name, year, url) {
    window.location.href = "/product?set_num="+set_num 
  }

  render() {    
    return (
      <div className="Sets">

        <PageNavbar active="sets" />
  
        <br></br>
        <div className="container sets-container">
          <div className="jumbotron">
            <div className="h5">LEGO Sets</div>
            <div className="sets-container">
              {this.state.sets}
            </div>
          </div>
        </div>
      </div>
    );
  }
}