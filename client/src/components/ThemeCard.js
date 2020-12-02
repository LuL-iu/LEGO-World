import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Box, ButtonGroup, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = theme => ({
    box: {
        width: "100px",
        height: "50px"
    },
    paper: {
        width: "100%",
        height: "100%",
        textAlign: "center",
        backgroundColor: '#9370DB',
        fontSize: 10,
        fontStyle: 'bold',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: '#FFFFFF'
     },
     button: {
         width: "100px",
         height: "25px",
         fontSize: 10,
         backgroundColor: "#E6E6FA"
     },
});


class ThemeCard extends React.Component {
    constructor(props) {
        super(props);

        /* props looks like:
		{
			themeName
			themeId
		}
		*/
        
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
        const { classes } = this.props;
        return (
            <Box className={classes.box} onMouseLeave={this.handleMouseLeave}>
                {!this.state.selected && 
                    <Paper onClick={this.handleSelectedToggle} className={classes.paper}><b>{this.props.themeName}</b></Paper>
                }
                {this.state.selected &&
                    <Grid container>
                        <Grid item> <Link to={"/sets/"+this.props.themeId}><Button className={classes.button}>View Sets</Button></Link> </Grid>
                        <Grid item> <Button className={classes.button}>View Minifigs</Button></Grid>
                    </Grid> 
                } 
            </Box>
        );
    }
}

export default withStyles(useStyles)(ThemeCard)