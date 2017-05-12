import control from './controls';
import React from 'react';
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';

const SIZE_FROM = [10, 20, 30, 40, 50];

const SIZE_TO = [60, 70, 80, 90, 100];

const newControls = {
    // Pie Chart
    donut: Object.assign({},control.donut, { renderTrigger : true }),
    labels_outside: Object.assign({},control.labels_outside, { renderTrigger : true }),

    // Dual Axis Line Chart
    y_axis_2_format: Object.assign({},control.y_axis_2_format, { renderTrigger : true }),

    // Stacked
    stacked_style: Object.assign({},control.stacked_style, { renderTrigger : true }),

    // Table View
    table_timestamp_format: Object.assign({},control.table_timestamp_format,{ renderTrigger : true }),
    page_length: Object.assign({},control.page_length,{ renderTrigger : true }),

    //Word Cloud
    rotation: Object.assign({},control.rotation,{ renderTrigger : true }),
    size_from: Object.assign({},control.size_from,{ renderTrigger : true,type: 'SelectControl', freeForm: true,
                                                    choices : formatSelectOptions(SIZE_FROM) }),
    size_to: Object.assign({},control.size_to,{ renderTrigger : true,type: 'SelectControl', freeForm: true,
                                                    choices : formatSelectOptions(SIZE_TO) }),

    //TreeMap
    number_format: Object.assign({},control.number_format,{ renderTrigger : true }),
    treemap_ratio: Object.assign({},control.treemap_ratio,{ renderTrigger : true }),

    //Filter Box
    date_filter: Object.assign({},control.date_filter,{ renderTrigger : true }),

    //HeatMap
    linear_color_scheme: Object.assign({},control.linear_color_scheme,{ renderTrigger : true }),
    xscale_interval: Object.assign({},control.xscale_interval,{ renderTrigger : true }),
    yscale_interval: Object.assign({},control.yscale_interval,{ renderTrigger : true }),
    canvas_image_rendering: Object.assign({},control.canvas_image_rendering,{ renderTrigger : true }),

    //Force Layout
    link_length: Object.assign({},control.link_length,{ renderTrigger : true }),
    charge: Object.assign({},control.charge,{ renderTrigger : true }),

    //Bullet Chart
    markers: Object.assign({},control.markers,{ renderTrigger : true }),
    marker_labels: Object.assign({},control.marker_labels,{ renderTrigger : true }),
    marker_lines: Object.assign({},control.marker_lines,{ renderTrigger : true }),
    marker_line_labels: Object.assign({},control.marker_line_labels,{ renderTrigger : true }),
    ranges: Object.assign({},control.ranges,{ renderTrigger : true }),
    range_labels: Object.assign({},control.range_labels,{ renderTrigger : true }),

    //Bubble Chart
    max_bubble_size: Object.assign({},control.max_bubble_size,{ renderTrigger : true }),

    //Big Number
    subheader: Object.assign({},control.subheader,{ renderTrigger : true }),

    //Parallel Coordinates
    show_datatable: Object.assign({},control.show_datatable,{ renderTrigger : true }),

    //Horizon
    series_height: Object.assign({},control.series_height,{ renderTrigger : true }),
    horizon_color_scale: Object.assign({},control.horizon_color_scale,{ renderTrigger : true }),

    //Collapsible Force Layout
    gravity: Object.assign({},control.gravity,{ renderTrigger : true }),


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
    }




}


const controls = Object.assign({}, control, newControls );

export default controls;