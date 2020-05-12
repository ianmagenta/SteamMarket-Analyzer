import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          parentHeightOffset: 0,
          background: "#1d1d1d",
          toolbar: {
            offsetY: -27,
          },
        },
        xaxis: {
          categories: this.props.categories,
        },
        theme: {
          mode: "dark",
          palette: "palette10",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
      },
      series: [
        {
          name: this.props.name,
          data: this.props.data,
        },
      ],
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart height="270" options={this.state.options} series={this.state.series} type={this.props.type} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
