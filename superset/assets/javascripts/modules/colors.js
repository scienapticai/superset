import $ from 'jquery';
import d3 from 'd3';

// Color related utility functions go in this object
export const bnbColors = [
    // https://www.tableau.com/about/blog/2016/7/colors-upgrade-tableau-10-56782
    '#4e79a7',
    '#59a14f',
    '#9c755f',
    '#f28e2b',
    '#edc948',
    '#bab0ac',
    '#e15759',
    '#b07aa1',
    '#76b7b2',
    '#ff9da7',
    '#4e79a7',
    '#59a14f',
    '#9c755f',
    '#f28e2b',
    '#edc948',
    '#bab0ac',
    '#e15759',
    '#b07aa1',
    '#76b7b2',
    '#ff9da7',
    '#4e79a7',
];

const spectrums = {
    blue_white_yellow: [
        '#00d1c1',
        'white',
        '#ffb400',
    ],
    fire: [
        'white',
        'yellow',
        'red',
        'black',
    ],
    white_black: [
        'white',
        'black',
    ],
    black_white: [
        'black',
        'white',
    ],
};

export const category21 = (function () {
    // Color factory
    const seen = {};
    return function (s) {
        if (!s) {
            return;
        }
        let stringifyS = String(s);
        // next line is for superset series that should have the same color
        stringifyS = stringifyS.replace('---', '');
        if (seen[stringifyS] === undefined) {
            seen[stringifyS] = Object.keys(seen).length;
        }
        /* eslint consistent-return: 0 */
        return bnbColors[seen[stringifyS] % bnbColors.length];
    };
}());

export const colorScalerFactory = function (colors, data, accessor) {
    // Returns a linear scaler our of an array of color
    if (!Array.isArray(colors)) {
        /* eslint no-param-reassign: 0 */
        colors = spectrums[colors];
    }
    let ext = [0, 1];
    if (data !== undefined) {
        ext = d3.extent(data, accessor);
    }
    const points = [];
    const chunkSize = (ext[1] - ext[0]) / colors.length;
    $.each(colors, function (i) {
        points.push(i * chunkSize);
    });
    return d3.scale.linear().domain(points).range(colors);
};
