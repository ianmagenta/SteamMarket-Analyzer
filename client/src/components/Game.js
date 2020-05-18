import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Chart from "./Chart";
import Snackbar from "@material-ui/core/Snackbar";

function ApiAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  listImage: {
    width: "100%",
    maxWidth: "460px",
  },
  listItem: {
    justifyContent: "center",
  },
  chip: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  icon: {
    width: "100%",
    height: "100%",
    maxWidth: "300px",
    maxHeight: "300px",
  },
  alert: {
    backgroundColor: "#1976d2",
  },
  snack: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function FullWidthGrid(props) {
  const appid = props.match.params.appid;
  const classes = useStyles();
  const [gameFound, setGameFound] = useState(true);
  const [developer, setDeveloper] = useState("None");
  const [publisher, setPublisher] = useState("None");
  const [ccu, setCcu] = useState("None");
  const [genres, setGenres] = useState(["None"]);
  const [prices, setPrices] = useState([0, 0]);
  const [reviewScores, setReviewScores] = useState([0, 0]);
  const [tags, setTags] = useState([["None"], [0]]);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/appdetails&appid=${appid}`, { signal: signal });
        const data = await response.json();
        if (data === "Connection failed: Too many connections" || data === "{}" || !response.ok) {
          setOpen(true);
          return;
        }
        if (data.name === null || data.developer === "" || isNaN(parseInt(appid, 10))) {
          setGameFound(false);
          return;
        }
        console.log(data);
        setDeveloper(data.developer);
        setPublisher(data.publisher);
        setCcu(data.ccu);
        setGenres(data.genre.split(",").map((genre) => genre.trim()));
        setPrices([parseInt(data.initialprice, 10) / 100, parseInt(data.price, 10) / 100]);
        setReviewScores([data.positive, data.negative]);
        setTags([Object.keys(data.tags), Object.values(data.tags)]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {!gameFound ? (
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert
                icon={<HelpOutlineIcon className={classes.icon} />}
                className={classes.alert}
                variant="filled"
                style={{ alignItems: "center" }}
              >
                <Typography variant="h4">Game Not Found.</Typography>
                <Typography variant="h6">The appid you are looking for does not appear to be on Steam.</Typography>
              </Alert>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card style={{ height: "100%", display: "flex" }}>
                <ListItem disableGutters={true} className={classes.listItem} cols={1}>
                  <img
                    className={classes.listImage}
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg?t=1568751918`}
                    alt={appid}
                  />
                </ListItem>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card style={{ height: "100%" }}>
                <CardContent
                  style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                >
                  <Box fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                    Developer -{" "}
                    <Box color="warning.dark" display="inline" fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                      {developer}
                    </Box>
                  </Box>
                  <Box fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                    Publisher -{" "}
                    <Box color="warning.dark" display="inline" fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                      {publisher}
                    </Box>
                  </Box>
                  <Box fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                    Concurrent Users -{" "}
                    <Box color="warning.dark" display="inline" fontSize="h6.fontSize" fontWeight="h6.fontWeight">
                      {ccu}
                    </Box>
                  </Box>

                  <div className={classes.chip}>
                    <Typography variant="h6">Genres - </Typography>
                    {genres.map((genre) => (
                      <Chip size="small" key={genre} label={genre} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Price (USD) - ${prices[1]}</Typography>
                  <Chart
                    labels=""
                    type="bar"
                    name=""
                    categories={["Base Price", "Current Price"]}
                    data={prices}
                    pal="palette6"
                    colors={["#43BCCD"]}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Review Sores - Net Positive {reviewScores[0] - reviewScores[1]}</Typography>
                  <Chart
                    labels=""
                    type="bar"
                    name=""
                    categories={["Positive Reviews", "Negative Reviews"]}
                    data={reviewScores}
                    pal="palette8"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Tags By Votes</Typography>
                  <Chart
                    colors={["#F9C80E"]}
                    labels=""
                    type="bar"
                    name=""
                    categories={tags[0]}
                    data={tags[1]}
                    pal="palette5"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <div className={classes.snack}>
            <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
              <ApiAlert onClose={handleClose} severity="warning">
                The Steam Spy API seems to be having issues. Some data may not display or load correctly.
              </ApiAlert>
            </Snackbar>
          </div>
        </div>
      )}
    </>
  );
}
