/**
 * Created by bala on 11/5/17.
 */

export function fetchDownloadOptions(viz_type) {
    switch (viz_type) {
        case 'area':
        case 'bar':
        case 'big_number':
        case 'box_plot':
        case 'bubble':
        case 'bullet':
        case 'cal_heatmap':
        case 'compare':
        case 'directed_force':
        case 'dist_bar':
        case 'filter_box':
        case 'heatmap':
        case 'histogram':
        case 'horizon':
        case 'markup':
        case 'para':
        case 'pie':
        case 'separator':
        case 'sunburst':
        case 'line':
        case 'treemap':
        case 'word_cloud':
        case 'world_map':
        case 'dual_line':
        case 'UkViz':
        case 'LinePlusBarChartViz':
        case 'BubbleWithFilterViz':
        case 'SunburstIntensityViz':
        case 'coffee_wheel':
            return ['png', 'csv'];
        case 'collapsible_force':
        case 'big_number_total':
        case 'pivot_table':
        case 'sankey':
        case 'table':
            return ['csv'];
        default:
            return [];
    }
}
