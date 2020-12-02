import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from "@material-ui/core/Container";
import ThemeCard from './ThemeCard';
import Typography from '@material-ui/core/Typography';
import PageNavbar from './PageNavbar';
import { withStyles } from '@material-ui/core/styles';
import { Box, Button, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = theme => ({
    heading: {
        textAlign: "center",
        color: '#737373'
     },
     button: {
        width: "100%",
        backgroundColor: "#FCD000",
        color: "#FFFFFF",
        '&:hover': {
            backgroundColor: "#a6a6a6",
            color: '#FFF'
        }
    },
});


class Home extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            themes: []
        };
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
        console.log(themes)
        let themeGridItems = themes.map((theme, i) => {
            return <Grid item xs={1}> <ThemeCard themeName={theme.name} themeId={theme.id} /> </Grid>;
        });

        this.setState({
            themes: themeGridItems
        });

        }, err => {
        console.log(err)
        });
    }

    render() {
        const { classes } = this.props;
        return (
        <div>
            <PageNavbar  />            
            <Container maxWidth="lg">
                    <Box paddingTop={4}><Typography className={classes.heading} variant="h3" gutterBottom>SELECT A THEME TO START EXPLORING THE WORLD OF LEGO</Typography></Box>
                    <Grid container spacing={1}>
                        {this.state.themes}
                    </Grid>
                    <Box paddingTop={2}>
                        <Link to={"/minifiggame"}><Button className={classes.button}>PLAY MINIFIG TRIVIA!</Button></Link>
                    </Box>
            </Container>            
        </div>
        );
    }
}

export default withStyles(useStyles)(Home)