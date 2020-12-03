import React from 'react';
import { Box, ButtonGroup, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../style/ThemeCard.css';


class ThemeCard extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selected: false
        };

        this.handleSelectedToggle=this.handleSelectedToggle.bind(this);
        this.handleMouseLeave=this.handleMouseLeave.bind(this);
    }

    handleSelectedToggle() {
        this.setState({
            selected: true
        });
    }

    handleMouseLeave() {
        if (this.state.selected) {
            this.setState({
                selected: false
            });
        }
    }

    render() {
        return (
            <Box className="box"  onMouseLeave={this.handleMouseLeave}>
                {!this.state.selected && 
                    <div onClick={this.handleSelectedToggle} className="themeButton">{this.props.themeName}</div>
                }
                {this.state.selected &&
                    <Grid container>
                        <Grid item> <Link to={"/sets/"+this.props.themeId}><Button className= 'titleButton'>View Sets</Button></Link> </Grid>
                        <Grid item> <Button className="titleButton">View Minifigs</Button></Grid>
                    </Grid> 
                } 
            </Box>
        );
    }
}

export default ThemeCard