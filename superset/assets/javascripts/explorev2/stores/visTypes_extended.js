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
        }
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
      label: 'Bar chart without group by',
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

    }
}


$.extend(visTypes, newVisTypes);

export default visTypes;