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
import CardActionArea from "@material-ui/core/CardActionArea";

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

const listStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  listItem: {
    justifyContent: "center",
  },
  listImage: {
    width: "100%",
    maxWidth: "460px",
    // marginTop: theme.spacing(2),
  },
}));

export default function Snapshot() {
  const classes = useStyles();
  const listClasses = listStyles();
  const [ccu, setCcu] = useState([
    [1589235234000, 17363681],
    [1589235520000, 17255569],
    [1589235806000, 17154532],
    [1589236092000, 17053997],
    [1589236378000, 16950161],
  ]);
  const [top100, setTop100] = useState([570, 434170, 548430]);

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
        const response = await fetch("/api/text/top100in2weeks");
        if (!response.ok) {
          throw response;
        }
        const data = await response.text();
        const newData = data.split(/:{|\n/);
        const numberData = newData.filter((item) => item.length < 10);
        const almostfinalData = numberData.map((item) => parseInt(item.match(/\d+/g)[0], 10));
        const finalData = almostfinalData.filter((item) => item > 550);
        setTop100(finalData);
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
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Games (Based on Player Count)</Typography>
              <List dense cols={1} margin={0}>
                {top100.map((key) => (
                  <CardActionArea>
                    <ListItem
                      disableGutters={true}
                      component="a"
                      href={`/search/${key}`}
                      className={listClasses.listItem}
                      key={key}
                      cols={1}
                    >
                      <img
                        className={listClasses.listImage}
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${key}/header.jpg?t=1568751918`}
                        alt={key}
                      />
                    </ListItem>
                  </CardActionArea>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
