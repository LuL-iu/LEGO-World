import React from 'react';
import '../style/Home.scss';
import ThemeBlock from './ThemeBlock';
import ThemeCard from './ThemeCard';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grouped: [],
            themes: [],
            themeObj : []
        };
        this.mapComponent = this.mapComponent.bind(this);
        this.myFunction = this.myFunction.bind(this);

    }

    componentDidMount() {
        fetch("http://localhost:8081/top-level-themes",
        {
        method: 'GET' // The type of HTTP request.
        }).then(res => {
        return res.json();
        }, err => {
        console.log(err);
        }).then(themes => {
        if (!themes) return;
        this.state.themes = themes.map((theme, i) => {
           return {name: theme.name, id: theme.id};
        });
        this.groupCard();
        console.log(this.state.grouped);
        this.mapComponent();
        console.log(this.state.themeObj);
        }, err => {
        console.log(err)
        });
    }
    
    groupCard(){
        let wordsArray = this.state.themes;
        let grouped = wordsArray.reduce(function(acc, curr) {
       if (acc.hasOwnProperty(curr.name.charAt(0))) {
            acc[curr.name.charAt(0)].push({name: curr.name, id: curr.id})
        } else {
            acc[curr.name.charAt(0)] = [{name: curr.name, id: curr.id}]
        }
        return acc;
        }, {})
        this.state.grouped = grouped;
    }

    mapComponent(){
        var word = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P" , "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        var j;
        var themeDivs = [];
        var category = ["A-C", "D-F", "G-I", "J-L", "M-O", "P-R", "S-U", "V-Z"];
        for(j = 0; j < 8; j ++){
            var array = [];
            var k;
            for(k = 0; k < 3; k ++){
                if(3*j + k >= 24){
                    continue;
                }
                let key = word[3*j + k];
                console.log(key)
                if(key == 'K' || key == 'Y'){
                    continue;
                }
                var newIds = this.state.grouped[key];
                array.push(newIds.map((theme, i) =>{
                    return (<ThemeCard className = "themeTitle" themeId={theme.id}  themeName={theme.name} />)
                }))
                if(3*j + k + 1 == 24){
                    newIds = this.state.grouped['Z'];
                    array.push(newIds.map((theme, i) =>{
                    return (<ThemeCard className = "themeTitle" themeId={theme.id}  themeName={theme.name} />)
                }))
                }
            }
            let ele =<ThemeBlock className = "theme"  themes = {array} category ={category[j]}/>
            themeDivs.push(ele);
        }
        // const newIds = this.state.grouped["A"];
        // console.log(newIds);
        // let setDivs = newIds.map((theme, i) =>{
        //     return (<div className = "theme">{theme}</div>)
        // })
        this.setState({
            themeObj: themeDivs
        });
        
    }

    showSets(theme){

    }

    myFunction(item) {
       this.state.themeObj.push(item);
    }

    render() {
        return(
            <div className ="wholePage">
                <div className ="centerBox">
                    <div className = "MainTitle">LEGO WORLD</div>
                    <div className= "ButtonContainer">
                        <div className= "GameButton">
                        <Link to={"/minifiggame"}><div className="GameText">PLAY MINIFIG TRIVIA!</div></Link></div> 
                    </div>
                    <div className= "instruction"> Choose A Theme to Explore LEGO World</div>
                    <div className="HomeContainer">
                        <div className="themeContainer">
                        {/* <div className = "objContainter"> */}
                            {this.state.themeObj}
                        {/* </div>   */}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

// export default withStyles(useStyles)(Home);