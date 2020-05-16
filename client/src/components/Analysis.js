import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Chip from "@material-ui/core/Chip";

import Tags from "./Tags";

// Start table stuff

function createData(name, number, reviews, price, avgc) {
  return { name, number, reviews, price, avgc };
}

function returnAvg(arr) {
  if (arr.length === 0) {
    return 0;
  } else {
    let sum = 0;
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] !== 0) {
        sum += arr[j];
      }
    }
    return sum / arr.length;
  }
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tag Name",
  },
  { id: "number", numeric: true, disablePadding: false, label: "# of Games With Tag" },
  { id: "reviews", numeric: true, disablePadding: false, label: "Avg Net Review Score" },
  { id: "price", numeric: true, disablePadding: false, label: "Avg Price (in USD)" },
  { id: "avgc", numeric: true, disablePadding: false, label: "Avg Concurrent Users" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  return (
    <Toolbar style={{ paddingLeft: 0 }}>
      <Typography variant="h6" id="tableTitle" component="div">
        Top 75+ Games by Tag
      </Typography>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

// End table stuff

const useStyles2 = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  chip: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function FullWidthGrid() {
  const classes2 = useStyles2();
  const [tagData, setTagData] = useState(Tags);
  const dense = true;

  // Table
  const classes = useStyles();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("number");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [marketGaps, setMarketGaps] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        const response = await fetch("/api/top100in2weeks");
        if (!response.ok) {
          throw response;
        }
        const data = await response.json();
        const filterData = Object.keys(data)
          .filter((key) => Number.parseInt(key, 10) > 550)
          .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
          }, {});

        let completeData = [];
        for (let key in filterData) {
          const res = await fetch(`/api/appdetails&appid=${key}`, { signal: signal });
          const resData = await res.json();
          completeData.push(resData);
          // console.log(completeData);
        }

        // API DOWN
        // let completeData = [
        //   { tags: { Horror: 10, Indie: 10 }, positive: 100, negative: 2, price: "0", ccu: 10 },
        //   { tags: { Horror: 10, Action: 10 }, positive: 100, negative: 50, price: "2999", ccu: 20 },
        // ];
        // console.log("resume");
        // API DOWN

        // Whew!
        for (let i = 0; i < completeData.length; i++) {
          await fetch("/api/wait", { signal: signal });
          for (let key in completeData[i].tags) {
            const index = tagData.findIndex((e) => e.tag === key);
            if (index !== -1) {
              const newArray = [...tagData];
              newArray[index].count += 1;
              newArray[index].reviewScore.push(completeData[i].positive - completeData[i].negative);
              const parsedPrice = parseInt(completeData[i].price, 10) / 100;
              newArray[index].averagePrice.push(parsedPrice);
              newArray[index].averageCcu.push(completeData[i].ccu);
              // console.log(newArray[index]);
              setTagData(newArray);
            }
          }
        }
        for (let i = 0; i < tagData.length; i++) {
          // console.log(rows);
          await fetch("/api/wait", { signal: signal });
          if (tagData[i].count > 0) {
            setRows((rows) => [
              ...rows,
              createData(
                tagData[i].tag,
                tagData[i].count,
                Math.floor(returnAvg(tagData[i].reviewScore)),
                parseFloat(returnAvg(tagData[i].averagePrice).toFixed(2)),
                Math.floor(returnAvg(tagData[i].averageCcu))
              ),
            ]);
          } else {
            setMarketGaps((marketGaps) => [...marketGaps, tagData[i].tag]);
          }
        }
      } catch (err) {
        // console.log(err);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className={classes2.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {rows.length > 1 ? (
                <div className={classes.root}>
                  <EnhancedTableToolbar />
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={dense ? "small" : "medium"}
                      aria-label="enhanced table"
                    >
                      <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                      />
                      <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">{row.number}</TableCell>
                                <TableCell align="right">{row.reviews}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="right">{row.avgc}</TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              ) : (
                <>
                  <Typography variant="h6">Analyzing Top Games... (This may take a couple of minutes)</Typography>
                  <Skeleton animation="wave" variant="rect" height={455} />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              {marketGaps.length > 5 ? (
                <>
                  <Typography variant="h6">Under-Used Genres (Missing from the Top 75+)</Typography>
                  <CardContent />
                  <div className={classes2.chip}>
                    {marketGaps.map((gap) => (
                      <Chip key={gap} label={gap} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Typography variant="h6">Analyzing Market Gaps... (This may take a couple of minutes)</Typography>
                  <Skeleton animation="wave" variant="rect" height={100} />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
