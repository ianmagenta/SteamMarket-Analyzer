import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chart from "./Chart";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const getAll = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/top100in2weeks");
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    console.log(data[Object.keys(data)[0]]);
    // const otherData = await JSON.parse(data);
    // console.log(typeof otherData, otherData);
  } catch (err) {
    console.log(err);
  }
};

export default function Snapshot() {
  const classes = useStyles();

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">This is a test card</Typography>
              <Chart
                type="area"
                name=""
                data={[30, 40, 45, 50, 49, 60, 70, 91]}
                categories={[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
