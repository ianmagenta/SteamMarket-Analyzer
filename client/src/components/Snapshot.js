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
import Skeleton from "@material-ui/lab/Skeleton";

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
  const [popularGenres, setPopularGenres] = useState([1, 1, 1]);
  const [popularGenresCat, setPopularGenresCat] = useState(["Action", "Adventure", "FPS"]);
  const [popularTags, setPopularTags] = useState([0, 0, 0]);
  const [popularTagsCat, setPopularTagsCat] = useState(["Action", "Adventure", "FPS"]);

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
      function arrayAmount(arr1) {
        var a = [],
          b = [],
          prev;

        let arr = arr1.concat().sort();
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
          } else {
            b[b.length - 1]++;
          }
          prev = arr[i];
        }
        return [a, b];
      }

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
        const genreData = [];
        const tagData = [];
        for (let i = 0; i < finalData.length; i++) {
          const res = await fetch(`/api/appdetails&appid=${finalData[i]}`);
          const resData = await res.json();

          // Genre Data
          genreData.push(...resData.genre.split(",").map((item) => item.trim()));
          const chartData = arrayAmount(genreData);
          setPopularGenres(chartData[1]);
          setPopularGenresCat(chartData[0]);

          // Tag Data
          tagData.push(...Object.keys(resData.tags));
          const chartTagData = arrayAmount(tagData);
          for (let j = 0; j < chartTagData[1].length; j++) {
            if (chartTagData[1][j] < 20) {
              chartTagData[1][j] = 0;
              chartTagData[0][j] = "";
            }
          }
          chartTagData[1] = chartTagData[1].filter((item) => item !== 0);
          chartTagData[0] = chartTagData[0].filter((item) => item !== "");
          console.log(chartTagData);
          setPopularTags(chartTagData[1]);
          setPopularTagsCat(chartTagData[0]);
        }
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
              <Typography variant="h6">Steam Concurrent Users (Past 24 Hours)</Typography>
              <Chart
                type="area"
                name="Concurrent Users"
                data={ccu}
                categories="none"
                xaxisFormat="datetime"
                tooltipFormat="MMM dd | HH:mm"
                pal="palette10"
                labels=""
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Most Popular Genres (By Top 70+ Games)</Typography>
              {popularTags.length > 3 ? (
                <Chart labels="" type="bar" name="" categories={popularGenresCat} data={popularGenres} pal="palette4" />
              ) : (
                <Skeleton animation="wave" variant="rect" height={270} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Most Popular Genre Tags (By Top 70+ Games)</Typography>
              {popularTags.length > 3 ? (
                <Chart labels="" type="bar" name="" categories={popularTagsCat} data={popularTags} pal="palette7" />
              ) : (
                <Skeleton animation="wave" variant="rect" height={270} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top 70+ Games (Based on Player Count)</Typography>
              <List dense cols={1} margin={0}>
                {top100.map((key) => (
                  <CardActionArea key={key}>
                    {top100.length > 3 ? (
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
                    ) : (
                      <Skeleton animation="wave" variant="rect" height={270} />
                    )}
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
