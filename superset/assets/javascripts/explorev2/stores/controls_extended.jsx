import control from './controls';
import React from 'react';
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';

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
        choices: formatSelectOptions(['0.05','0.1','0.15','0.2','0.25','0.3','0.35','0.4','0.45','0.5','0.55','0.6','0.65',
            '0.7','0.75','0.8','0.85','0.9','0.95','1.0',]),
        description: 'Gravity in the force layout',
    }

}


const controls = Object.assign({}, control, newControls );

export default controls;