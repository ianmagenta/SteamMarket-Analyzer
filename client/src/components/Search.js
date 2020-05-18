import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ListItem from "@material-ui/core/ListItem";
import CardActionArea from "@material-ui/core/CardActionArea";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ErrorImage from "../images/testapp.svg";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
  listItem: {
    justifyContent: "center",
  },
  listImage: {
    width: "100%",
    maxWidth: "460px",
  },
  snack: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const bannedWordList = [
  "",
  " ",
  "a",
  "and",
  "or",
  "the",
  "to",
  "#",
  "@",
  "'",
  '"',
  "!",
  "@",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "+",
  "=",
  ",",
  ".",
  "?",
  "/",
  "`",
  "~",
  "\\",
];

export default function FullWidthGrid(props) {
  const queryString = decodeURIComponent(props.match.params.queryString);
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [finishedSearch, setFinishedSearch] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setFinishedSearch(false);
    setSearchResults([]);
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        const response = await fetch("/api/all", { signal: signal });
        const data = await response.json();
        const values = Object.values(data);
        if (data === "Connection failed: Too many connections" || values.length === 0 || !response.ok) {
          setOpen(true);
          return;
        }
        const isInt = isNaN(parseInt(queryString, 10)) ? false : true;

        let matches = [];
        let intTerm = new RegExp(`^${queryString}$`, "im");

        for (let i = 0; i < values.length; i++) {
          if (isInt) {
            const match = values[i].appid.toString().match(intTerm);
            if (match) {
              matches.push(values[i]);
            }
          } else {
            const terms = queryString.split(" ");
            for (let j = 0; j < terms.length; j++) {
              if (bannedWordList.includes(terms[j].toLowerCase()) || !isNaN(parseInt(terms[j], 10))) {
                continue;
              }
              const match = values[i].name.match(new RegExp(`${terms[j]}`, "im"));
              if (match) {
                matches.push(values[i]);
                break;
              }
            }
          }
        }

        setSearchResults(matches);
        setFinishedSearch(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [queryString]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              {!finishedSearch ? (
                <>
                  <Typography variant="h6" align="center">
                    Searching for Games...
                  </Typography>
                  <Skeleton animation="wave" />
                </>
              ) : searchResults.length > 0 ? (
                <>
                  <Typography variant="h6" align="center">
                    Search Results
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" align="center">
                    No results found for
                  </Typography>
                  <Typography variant="h6" align="center">
                    " {queryString} "
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        {finishedSearch ? (
          <>
            {searchResults.map((result) => (
              <Grid item xs={12} sm={6} lg={3} xl={2} key={result.appid}>
                <Card>
                  <CardActionArea>
                    <ListItem
                      disableGutters={true}
                      component="a"
                      href={`/game/${result.appid}`}
                      className={classes.listItem}
                      cols={1}
                    >
                      <img
                        className={classes.listImage}
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${result.appid}/header.jpg?t=1568751918`}
                        alt={result.name}
                        onError={(e) => (e.target.src = ErrorImage)}
                      />
                    </ListItem>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
      <div className={classes.snack}>
        <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleClose} severity="warning">
            The Steam Spy API seems to be having issues. Some data may not display or load correctly.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
