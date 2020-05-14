import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chart from "./Chart";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

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

export default function Snapshot() {
  const classes = useStyles();
  const [ccu, setCcu] = useState([
    [1589235234000, 17363681],
    [1589235520000, 17255569],
    [1589235806000, 17154532],
    [1589236092000, 17053997],
    [1589236378000, 16950161],
  ]);
  const [top100, setTop100] = useState({ "570": "dota", "434170": "dota", "548430": "dota" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/steam/ccu");
        if (!response.ok) {
          throw response;
        }
        const [data] = await response.json();
        setCcu(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData2 = async () => {
      try {
        const response = await fetch("/api/top100in2weeks");
        if (!response.ok) {
          throw response;
        }
        const data = await response.json();
        setTop100(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchData2();
  }, []);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Steam Concurrent Users</Typography>
              <Chart
                type="area"
                name="Concurrent Users"
                data={ccu}
                xaxisFormat="datetime"
                tooltipFormat="MMM dd | HH:mm"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top 50 Games (Based on Players)</Typography>
              <List dense cols={1} margin={0}>
                {Object.entries(top100)
                  .reverse()
                  .map(([key, value]) => (
                    <ListItem key={key} cols={1}>
                      <img
                        width="100%"
                        height="100%"
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${key}/header.jpg?t=1568751918`}
                        alt={key}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
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
