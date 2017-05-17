import control from './controls';
import React from 'react';
import $ from 'jquery'
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';
import {bnbColorsWithNames} from "../../customColors"

const SIZE_FROM = listGenerator(10,60,10);

const SIZE_TO = listGenerator(70,110,10);

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
    donut : updateControls(control.donut,{ renderTrigger : true }),
    labels_outside : updateControls(control.labels_outside,{ renderTrigger : true }),

    // Dual Axis Line Chart
    y_axis_2_format: updateControls(control.y_axis_2_format,{ renderTrigger : true }),

    // Stacked
    stacked_style: updateControls(control.stacked_style, { renderTrigger : true }),

    // Table View
    table_timestamp_format: updateControls(control.table_timestamp_format,{ renderTrigger : true }),
    page_length: updateControls(control.page_length,{ renderTrigger : true }),

    //Word Cloud
    rotation: updateControls(control.rotation,{ renderTrigger : true }),
    size_from: updateControls(control.size_from,{ renderTrigger : true,type: 'SelectControl', freeForm: true,
                                                    choices : SIZE_FROM }),
    size_to: updateControls(control.size_to,{ renderTrigger : true,type: 'SelectControl', freeForm: true,
                                                    choices : SIZE_TO }),

    //TreeMap
    number_format: updateControls(control.number_format,{ renderTrigger : true }),
    treemap_ratio: updateControls(control.treemap_ratio,{ renderTrigger : true }),

    //Filter Box
    date_filter: updateControls(control.date_filter,{ renderTrigger : true }),

    //HeatMap
    linear_color_scheme: updateControls(control.linear_color_scheme,{ renderTrigger : true }),
    xscale_interval: updateControls(control.xscale_interval,{ renderTrigger : true }),
    yscale_interval: updateControls(control.yscale_interval,{ renderTrigger : true }),
    canvas_image_rendering: updateControls(control.canvas_image_rendering,{ renderTrigger : true }),

    //Force Layout
    link_length: updateControls(control.link_length,{ renderTrigger : true }),
    charge: updateControls(control.charge,{ renderTrigger : true }),

    //Bullet Chart
    markers: updateControls(control.markers,{ renderTrigger : true }),
    marker_labels: updateControls(control.marker_labels,{ renderTrigger : true }),
    marker_lines: updateControls(control.marker_lines,{ renderTrigger : true }),
    marker_line_labels: updateControls(control.marker_line_labels,{ renderTrigger : true }),
    ranges: updateControls(control.ranges,{ renderTrigger : true }),
    range_labels: updateControls(control.range_labels,{ renderTrigger : true }),

    //Bubble Chart
    max_bubble_size: updateControls(control.max_bubble_size,{ renderTrigger : true }),

    //Big Number
    subheader: updateControls(control.subheader,{ renderTrigger : true }),

    //Parallel Coordinates
    show_datatable: updateControls(control.show_datatable,{ renderTrigger : true }),

    //Horizon
    series_height: updateControls(control.series_height,{ renderTrigger : true }),
    horizon_color_scale: updateControls(control.horizon_color_scale,{ renderTrigger : true }),

    //Collapsible Force Layout
    gravity: updateControls(control.gravity,{ renderTrigger : true }),


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
    start_color :{
        type: 'SelectControl',
        label : 'Start Color',
        freeForm: true,
        renderTrigger : true,
        default: 'red',
        choices: bnbColorsWithNames,
        description: 'This is the start color'
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
    end_color :{
        type: 'SelectControl',
        label : 'End Color',
        freeForm: true,
        renderTrigger : true,
        default: 'green',
        choices: bnbColorsWithNames,
        description: 'This is the end color'
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
        choices: bnbColorsWithNames,
        description: 'Values below min value will be colored with this color'
    },
    color: {
        type: 'SelectControl',
        label : 'Color',
        freeForm: true,
        multi: true,
        renderTrigger : true,
        default: null,
        choices: bnbColorsWithNames,
        description: 'Choose the list of colors for the chart'
    },

}

const controls = updateControls(control, newControls);

function updateControls(source, newFields) {
    return $.extend(true,{},source,newFields);

}

export default controls;
export  { SIZE_FROM , SIZE_TO };
