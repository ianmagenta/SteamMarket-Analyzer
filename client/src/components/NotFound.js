import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  alert: {
    backgroundColor: "#1976d2",
  },
}));

export default function FullWidthGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert
            icon={<HelpOutlineIcon className={classes.icon} />}
            className={classes.alert}
            variant="filled"
            style={{ alignItems: "center" }}
          >
            <Typography variant="h4">404 - Page Not Found.</Typography>
            <Typography variant="h6">
              Try clicking on one of the links on the sidebar (or performing a search).
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </div>
  );
}
