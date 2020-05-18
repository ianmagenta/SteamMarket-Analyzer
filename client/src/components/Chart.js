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
            // offsetY: -27,
          },
        },
        xaxis: {
          type: this.props.xaxisFormat,
        },
        theme: {
          mode: "dark",
          palette: this.props.pal,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        tooltip: {
          x: {
            format: this.props.tooltipFormat,
          },
        },
        colors: this.props.colors,
      },
      series: [
        {
          name: this.props.name,
          data: this.props.data,
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.categories !== this.props.categories) {
      this.setState({
        series: [
          {
            name: this.props.name,
            data: this.props.data,
          },
        ],
        options: {
          xaxis: {
            categories: this.props.categories,
            type: this.props.xaxisFormat,
          },
        },
      });
    }
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
