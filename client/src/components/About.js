import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import logo from "../images/SMA-logo2.svg";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  cardStyle: {
    height: "100%",
  },
  image: {
    maxHeight: "512px",
  },
}));

export default function FullWidthGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent margin="auto">
              <img src={logo} alt="logo" className={classes.image} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className={classes.cardStyle}>
            <CardContent>
              <Box fontSize="body1.fontSize">
                The{" "}
                <Box color="warning.light" display="inline" fontWeight="fontWeightBold">
                  SteamMarket Analyzer (SMA)
                </Box>{" "}
                is designed to give developers greater access to data from Steam, the #1 online marketplace for PC
                games. Specifically, SMA is designed to help developers who are struggling to find success on Steam's
                overcrowded storefront by giving them all the data they need to make a stand-out game.
              </Box>
            </CardContent>
            <CardContent>
              <Typography>
                SMA achieves this by leveraging Steam Spy's API and Steam's undocumented storefront API to display live
                stats about what games are succeeding (and could succeed) on the Steam marketplace.
              </Typography>
            </CardContent>
            <CardContent>
              <Typography>The site is divided into 4 parts:</Typography>
              <Box>
                <ul>
                  <li>
                    <Typography>Snapshot - A brief, live look at the Steam Store.</Typography>
                  </li>
                  <li>
                    <Typography>
                      Analysis - Game-making recommendations based on the current state of the store.
                    </Typography>
                  </li>
                  <li>
                    <Typography>Search - Look up stats about any Steam game via its name or appid.</Typography>
                  </li>
                  <li>
                    <Typography>About - You are here.</Typography>
                  </li>
                </ul>
              </Box>
            </CardContent>
            <CardContent>
              <Typography>If you have any questions, feel free to contact the site's creator.</Typography>
            </CardContent>
            <CardContent>
              <Typography variant="caption" display="block" gutterBottom>
                This product is not affiliated with nor endorsed by Steam or Valve. Please don't sue me, this is just a
                portfolio project.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box fontSize="body1.fontSize">
                This site was made by{" "}
                <Box color="secondary.dark" display="inline" fontWeight="fontWeightBold">
                  Ian Magenta
                </Box>
                {". "} For more information about the site (and its author) feel free to check out the links below!
              </Box>
            </CardContent>
            <CardContent>
              <List>
                <ListItem component="a" href="https://github.com/ianmagenta/SteamMarket-Analyzer" button>
                  <ListItemIcon>
                    <GitHubIcon />
                  </ListItemIcon>
                  <ListItemText>GitHub</ListItemText>
                </ListItem>
                <ListItem component="a" href="https://www.linkedin.com/in/ianmagenta/" button>
                  <ListItemIcon>
                    <LinkedInIcon />
                  </ListItemIcon>
                  <ListItemText>LinkedIn</ListItemText>
                </ListItem>
                <ListItem component="a" href="https://twitter.com/ianmagenta" button>
                  <ListItemIcon>
                    <TwitterIcon />
                  </ListItemIcon>
                  <ListItemText>Twitter</ListItemText>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
