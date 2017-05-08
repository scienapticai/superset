import control from './controls';
import React from 'react';

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

}


const controls = Object.assign({}, control, newControls );

export default controls;