import visTypes from './visTypes'
import $ from 'jquery';

const newVisTypes = {
    UkViz:{
      label: 'UKViz',
        controlPanelSections: [
        {
            label: 'Map Parameters',
            controlSetRows:[
                ['subregion'],
                ['metrics'],
            ]
        },
        {
            label: 'Chart Options',
            controlSetRows:[
                ['start_color'],
                ['end_color']
            ]
        },
        ]
      },

    LinePlusBarChartViz:{
      label: 'Line Plus Bar Chart',
        controlPanelSections:[
            {
                label: 'Line and Bar Selection',
                controlSetRows: [
                    ['metrics'], ['Bar_Metric'], ['groupby'],
                                             ['limit'],
                ]
            },
            {
                label: 'Chart Options',
                controlSetRows:[
                    ['x_axis_format'],
                    ['x_axis_label'], ['y_axis_label'],
                    ['reduce_x_ticks'], ['show_controls'],
                ]
            }
        ]
    },

    BubbleWithFilterViz:{
      label: 'Bubble chart without group by',
      controlPanelSections: [
        {
           controlSetRows: [
                ['series'], ['entity'],
                ['x'], ['y'],
                ['size'], ['limit'],
           ]
        },
        {
            label: 'Chart Options',
            controlSetRows: [
                ['bubble_x_ticks'],['bubble_y_ticks'],
                ['x_log_scale'], ['y_log_scale'],
                ['show_legend'],
                ['max_bubble_size'],
                ['x_axis_label'], ['y_axis_label'],
            ]
        }
      ]
    },

    SunburstIntensityViz:{
        label: 'Sunburst Intensity',
        controlPanelSections: [
            {
                controlSetRows: [
                    ['groupby'], ['metric'], ['secondary_metric'],
                    ['row_limit']
                ]
            }
        ],
        controlOverrides:{
            metric : {
                label: 'Primary Metric',
                description: "The primary metric is used to define the arc segment sizes",
            },
            secondary_metric: {
                label: 'Secondary Metric',
                description:
                            "This secondary metric is used to define the color as a ratio against the primary metric. If the two metrics match, color is mapped level groups",
            },
            groupby: {
                label: 'Hierarchy',
                description: "This defines the level of the hierarchy",
            },
        }

    },

    collapsible_force: {
        label: 'Collapsible Force Layout',
        controlPanelSections: [
            {
                label: 'Fields',
                controlSetRows: [
                    ['groupby'],
                    ['metric'],
                    ['row_limit'],
                ],
            },
            {
                label: 'Force Layout',
                controlSetRows: [
                    ['link_length'],
                    ['charge'],
                    ['gravity'],
                ],
            },
        ],
        controlOverrides: {
            groupby: {
                label: 'Hierarchy',
                description: 'Pick columns in hierarchial order like grand parent, parent, child. Enter atleast 2 columns ',
            },
        },
    },

    coffee_wheel: {
        label: 'Coffee Wheel',
        controlPanelSections: [
            {
                label: 'Fields',
                controlSetRows: [
                    ['groupby'],
                ]
            } ,
        ],
        controlOverrides: {
            groupby: {
                label: 'Hierarchy',
                description: 'Pick columns in hierarchial order like grand parent, parent, child. Enter atleast 2 columns ',
            },
        },
    },

    pivot_table_threshold_coloring: {
        label: 'Pivot Table Threshold Coloring',
        controlPanelSections: [
            {
                label: 'Options',
                controlSetRows: [
                    ['groupby', 'columns'],
                    ['metrics', 'pandas_aggfunc'],
                    ['min_value','max_value'],
                    ['pivot_color'],
                ],
            },
        ],
    },
}
//UserInput for custom Color Option To Charts
const visForColor = ["dist_bar", "pie", "line", "dual_line", "bar", "compare", "word_cloud"]//, "treemap", "cal_heatmap", "box_plot", "bubble", "bullet", "big_number", "big_number_total", "histogram"]
visForColor.forEach(function(viz){
    visTypes[viz].controlPanelSections.push({label:'Color Option', controlSetRows: [['color']]});
});


function assignValueToFirstNullLabel(visTypes){
    const viz = Object.keys(visTypes);
    const newVisType = {};
    viz.forEach(function (vizType) {
        const vizObject = visTypes[vizType];
        if (Array.isArray(vizObject.controlPanelSections)) {
            if (vizObject.controlPanelSections[0].label == null) {
                vizObject.controlPanelSections[0].label = 'Fields';
            }
        }
        else {
            if (vizObject.controlPanelSections.label == null) {
                vizObject.controlPanelSections.label = 'Fields';
            }
        }
        newVisType.vizType = vizObject;
    });
    return newVisType;
}

$.extend(visTypes,assignValueToFirstNullLabel(visTypes));
$.extend(visTypes, newVisTypes);

export default visTypes;