import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from "@material-ui/core/Container";
import ThemeCard from './ThemeCard';
import Typography from '@material-ui/core/Typography';
import PageNavbar from './PageNavbar';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    heading: {
        textAlign: "center",
        color: '#FF7F50'
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
            <Typography className={classes.heading} variant="h3" gutterBottom>SELECT A THEME TO START EXPLORING THE WORLD OF LEGO</Typography>
                <Grid container spacing={1}>
                    {this.state.themes}
                </Grid>
            </Container>
        </div>
        );
    }
}

export default withStyles(useStyles)(Home)