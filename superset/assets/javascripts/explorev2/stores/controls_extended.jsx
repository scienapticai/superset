import control from './controls';
import React from 'react';
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';

function listGenerator(start,end,step){
  const arr = [];
  let element = start;
  if(step == 0){
    return arr;
  }
  while(element<=end && element>=start){
    arr.push(element);
    element+=step;
  }
  return arr;
}

const newControls = {
    // Pie Chart
    donut: Object.assign({},control.donut, { renderTrigger : true }),

    // Dual Axis Line Chart
    y_axis_2_format: Object.assign({},control.y_axis_2_format, { renderTrigger : true }),

    // Stacked
    stacked_style: Object.assign({},control.stacked_style, { renderTrigger : true }),

    // Table View
    table_timestamp_format: Object.assign({},control.table_timestamp_format,{ renderTrigger : true }),
    page_length: Object.assign({},control.page_length,{ renderTrigger : true }),

    //Word Cloud
    rotation: Object.assign({},control.rotation,{ renderTrigger : true }),

    //TreeMap
    number_format: Object.assign({},control.number_format,{ renderTrigger : true }),

    //Filter Box
    date_filter: Object.assign({},control.date_filter,{ renderTrigger : true }),

    //HeatMap
    linear_color_scheme: Object.assign({},control.linear_color_scheme,{ renderTrigger : true }),
    xscale_interval: Object.assign({},control.xscale_interval,{ renderTrigger : true }),
    yscale_interval: Object.assign({},control.yscale_interval,{ renderTrigger : true }),
    canvas_image_rendering: Object.assign({},control.canvas_image_rendering,{ renderTrigger : true }),

    //UKMapViz Form Parameters
    subregion:{
        type: 'SelectControl',
        label: 'Subregion',
        clearable: true,
        default: null,
        mapStateToProps: state => ({
            choices: (state.datasource) ? state.datasource.gb_cols : [],
        }),
        description: 'Select the column that has the subregion information'
      },

    Bar_Metric:{
        type: 'SelectControl',
        label: 'Bar Metric',
        default: null,
        mapStateToProps: state => ({
              choices: (state.datasource) ? state.datasource.metrics_combo : [],
        }),
        description: 'Select the metric from the list of metrics to be visualised as bar'
    },

    bubble_x_ticks:{
        type: 'SelectControl',
        label: 'Bubble X Ticks',
        default: null,
        mapStateToProps: state => ({
                    choices: (state.datasource) ? state.datasource.gb_cols : [],
        }),
        description: 'Select column containing X ticks'
    },

    bubble_y_ticks:{
            type: 'SelectControl',
            label: 'Bubble Y Ticks',
            default: null,
            mapStateToProps: state => ({
                        choices: (state.datasource) ? state.datasource.gb_cols : [],
            }),
            description: 'Select column containing Y ticks'
    },

    //Collapsible_Force Form Parameters
    gravity: {
        type: 'SelectControl',
        freeForm: true,
        label: 'Gravity',
        default: '0.3',
        choices: formatSelectOptions(listGenerator(0,1,0.05)),
        description: 'Gravity in the force layout',
    },

    //Pivot Table Threshold Coloring
    min_value: {
        type: 'SelectControl',
        freeForm: true,
        label: 'lower bound',
        default: '0',
        choices: [0, 10, 100, 1000, 10000],
        description: 'Lower bound for coloring '
    },

    max_value: {
        type: 'SelectControl',
        freeForm: true,
        label: 'upper bound',
        default: '0',
        choices: [10, 100, 1000, 10000, 100000],
        description: 'Upper bound for coloring '
    },

    pivot_color: {
        type: 'SelectControl',
        freeForm: true,
        label: 'color',
        default: 'black',
        choices: [
            ['#4e79a7', 'blue' ],
            ['#59a14f',	'green'],
            ['#9c755f',	'brown'],
            ['#f28e2b',	'orange'],
            ['#edc948',	'yellow'],
            ['#bab0ac',	'grey'],
            ['#e15759',	'red'],
            ['#b07aa1',	'purple'],
            ['#76b7b2',	'sky-blue'],
            ['#ff9da7',	'magenta']
        ],
        description: 'Values below min value will be colored with this color'
    },

    //Distribution bar
    margin_left: {
        type: 'SelectControl',
        freeForm: true,
        renderTrigger: true,
        label: 'Margin Left',
        default: 10,
        choices: [0, 10, 25, 50, 100],
        description: 'Left side margin of chart'
    },

    legend_margin_bottom: {
        type: 'SelectControl',
        freeForm: true,
        renderTrigger: true,
        label: 'Legend Margin Bottom',
        default: 10,
        choices: [0, 10, 25, 50, 100],
        description: 'Bottom margin for legend',
    },

}


const controls = Object.assign({}, control, newControls );

export default controls;
