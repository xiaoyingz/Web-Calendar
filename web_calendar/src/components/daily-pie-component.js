import React, { Component } from 'react';
import * as d3 from 'd3';
import TaskService from '../services/task-service';

const margin = {
    top: 50, right: 50, bottom: 50, left: 50,
};
const outerRadius = 200;
const innerRadius = 100;
const width = 2 * outerRadius + margin.left + margin.right;
const height = 2 * outerRadius + margin.top + margin.bottom;

/**
 * Component for displaying the pie chart for everyday tasks.
 */
export default class DailyPie extends Component {
    /**
     * Represents a DailyPie component.
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.getDate = this.getDate.bind(this);
        this.retrievePieData = this.retrievePieData.bind(this);

        this.state = {
            date: '',
            pieData: {},
            errorMessage: '',
        };
    }

    /**
     * Retrieve today's pie data.
     */
    componentDidMount() {
        const date = this.getDate();
        this.setState({
            date,
        });
        this.retrievePieData(date);
    }

    /**
     * Helper to parse url to get date for visualization.
     * @returns string in the format of "YY-MM-DD".
     */
    getDate() {
        const paramDate = this.props.match.params.date;
        const today = new Date().toISOString().slice(0, 10);
        const date = (paramDate === undefined) ? String(today) : paramDate;
        return date;
    }

    /**
     * Call controller to get pie data from backend.
     * @param {String} date 
     */
    async retrievePieData(date) {
        try {
            const response = await TaskService.getPieData(date);
            const pieData = await response.data;
            this.setState({
                pieData,
            });
        } catch (err) {
            this.setState({
                errorMessage: 'No task today',
            });
        }
    }

    /**
     * Render DailyPie.
     */
    render() {
        const data = this.state.pieData;
        const colorScale = d3     
            .scaleSequential()      
            .interpolator(d3.interpolateCool)      
            .domain([0, data.length]);
        d3.select('#pie-container')
            .select('svg')
            .remove();

        const svg = d3
            .select('#pie-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
      
        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);
      
        const arc = svg
            .selectAll()
            .data(pieGenerator(data))
            .enter();
      
        // Append arcs
        arc
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0);
      
        // Append text labels
        arc
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label+":"+d.data.value)
            .style('fill', (_, i) => colorScale(data.length - data.length*i))
            .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });

        return (
            <div>
                <div id="pie-container" />
                <button
                    type="button"
                    onClick={this.props.history.goBack}
                    className="btn btn-outline-danger mr-2"
                >
                    Back
                </button>
            </div>
        );
    }
}
