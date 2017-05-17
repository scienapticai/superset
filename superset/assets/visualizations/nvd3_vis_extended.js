import $ from 'jquery';
import throttle from 'lodash.throttle';
import d3 from 'd3';

import { category21 } from '../javascripts/modules/colors';
import { timeFormatFactory, formatDate } from '../javascripts/modules/dates';
import { customizeToolTip } from '../javascripts/modules/utils';

import { TIME_STAMP_OPTIONS } from '../javascripts/explorev2/stores/controls';

const nv = require('nvd3');

// CSS
require('../node_modules/nvd3/build/nv.d3.min.css');
require('./nvd3_vis.css');

const timeStampFormats = TIME_STAMP_OPTIONS.map(opt => opt[0]);
const minBarWidth = 15;
const animationTime = 1000;

const BREAKPOINTS = {
  small: 340,
};

function hideTooltips() {
  $('.nvtooltip').css({ opacity: 0 });
}

function nvd3VisExtended(slice, payload) {
  let chart;
  let colorKey = 'key';
  const isExplore = $('#explore-container').length === 1;

  slice.container.html('');
  slice.clearError();

  // Calculates the longest label size for stretching bottom margin
  function calculateStretchMargins(payloadData) {
    let stretchMargin = 0;
    const pixelsPerCharX = 4.5; // approx, depends on font size
    let maxLabelSize = 10; // accommodate for shorter labels
    payloadData.data.forEach((d) => {
      const axisLabels = d.values;
      for (let i = 0; i < axisLabels.length; i++) {
        maxLabelSize = Math.max(axisLabels[i].x.toString().length, maxLabelSize);
      }
    });
    stretchMargin = Math.ceil(pixelsPerCharX * maxLabelSize);
    return stretchMargin;
  }

  let width = slice.width();
  const fd = slice.formData;

  const barchartWidth = function () {
    let bars;
    if (fd.bar_stacked) {
      bars = d3.max(payload.data, function (d) { return d.values.length; });
    } else {
      bars = d3.sum(payload.data, function (d) { return d.values.length; });
    }
    if (bars * minBarWidth > width) {
      return bars * minBarWidth;
    }
    return width;
  };

  const vizType = fd.viz_type;
  const f = d3.format('.3s');
  const reduceXTicks = fd.reduce_x_ticks || false;
  let stacked = false;
  let row;

  const drawGraph = function () {

    var chart_data;
    let svg = d3.select(slice.selector).select('svg');
    if (svg.empty()) {
      svg = d3.select(slice.selector).append('svg');
    }
    switch (vizType) {
        case 'LinePlusBarChartViz':
            chart = nv.models.linePlusBarChart();
            chart.margin({ top: 30, right: 60, bottom: 50, left: 90 })
                 .focusEnable(false);
            chart.xAxis
                 .showMaxMin(true)
                 .staggerLabels(true);
            break;
        case 'BubbleWithFilterViz':
            var row = function (col1, col2) {
                return "<tr><td>" + col1 + "</td><td>" + col2 + "</td></tr>";
            };
            chart = nv.models.scatterChart();
            chart.showDistX(true);
            chart.showDistY(true);
            chart.tooltip.contentGenerator(function (obj) {
                var p = obj.point;
                var s = "<table>";
                s += '<tr><td style="color:' + p.color + ';"><strong>' + p[fd.entity] + '</strong> (' + p.group + ')</td></tr>';
                if (Object.keys(payload.data.x_ticks_map).length > 0){
                  s += row(fd.bubble_x_ticks, payload.data.x_ticks_map[Math.round(f(p.x))]);
                }else{
                  s += row(fd.x, f(p.x));
                }
                if (Object.keys(payload.data.y_ticks_map).length > 0){
                  s += row(fd.bubble_y_ticks, payload.data.y_ticks_map[Math.round(f(p.y))]);
                }else{
                  s += row(fd.y, f(p.y));
                }

                s += row(fd.size, f(p.size));
                s += "</table>";
                return s;
          });
          chart.pointRange([5, fd.max_bubble_size * fd.max_bubble_size]);
          var y_array = Object.keys(payload.data.y_ticks_map);
          if (Object.keys(payload.data.y_ticks_map).length > 0){
                chart.yAxis.tickValues(y_array);
                chart.yAxis.tickFormat(function(d){
                    return payload.data.y_ticks_map[d];
                });
          }
          var x_array = Object.keys(payload.data.x_ticks_map);
          if (Object.keys(payload.data.x_ticks_map).length > 0){
                chart.xAxis.tickValues(x_array);
                chart.xAxis.tickFormat(function(d){
                    return payload.data.x_ticks_map[d];
                });
          }
          break;
        default:
            throw new Error("Unrecognized visualization for nvd3" + vizType);
    }

    if ('showLegend' in chart && typeof fd.show_legend !== 'undefined') {
          if (width < BREAKPOINTS.small && vizType !== 'pie') {
            chart.showLegend(false);
          } else {
            chart.showLegend(fd.show_legend);
          }
        }

        let height = slice.height() - 15;

        chart.height(height);
        slice.container.css('height', height + 'px');

        if (fd.y_axis_zero) {
              chart.forceY([0]);
            } else if (fd.y_log_scale) {
              chart.yScale(d3.scale.log());
            }
            if (fd.x_log_scale) {
              chart.xScale(d3.scale.log());
            }
            let xAxisFormatter;
            if (fd.x_axis_format === 'smart_date') {
              xAxisFormatter = formatDate;
              chart.xAxis.tickFormat(xAxisFormatter);
            } else if (fd.x_axis_format !== undefined) {
              xAxisFormatter = timeFormatFactory(fd.x_axis_format);
              chart.xAxis.tickFormat(xAxisFormatter);
            }

            const isTimeSeries = timeStampFormats.indexOf(fd.x_axis_format) > -1;
            // if x axis format is a date format, rotate label 90 degrees
            if (isTimeSeries) {
              chart.xAxis.rotateLabels(45);
            }

            if (chart.hasOwnProperty('x2Axis')) {
              chart.x2Axis.tickFormat(xAxisFormatter);
              height += 30;
            }

            if (fd.x_axis_format === 'smart_date') {
              chart.xAxis.tickFormat(formatDate);
            } else if (fd.x_axis_format !== undefined) {
              chart.xAxis.tickFormat(timeFormatFactory(fd.x_axis_format));
            }
            if (chart.yAxis !== undefined) {
              chart.yAxis.tickFormat(d3.format('.3s'));
            }

            if (fd.y_axis_format && chart.yAxis) {
              chart.yAxis.tickFormat(d3.format(fd.y_axis_format));
              if (chart.y2Axis !== undefined) {
                chart.y2Axis.tickFormat(d3.format(fd.y_axis_format));
              }
            }


            if (fd.x_axis_label && fd.x_axis_label !== '' && chart.xAxis) {
              let distance = 0;
              if (fd.bottom_margin && !isNaN(fd.bottom_margin)) {
                distance = fd.bottom_margin - 50;
              }
              chart.xAxis.axisLabel(fd.x_axis_label).axisLabelDistance(distance);
            }

            if (fd.y_axis_label && fd.y_axis_label !== '' && chart.yAxis) {
              chart.yAxis.axisLabel(fd.y_axis_label);
              chart.margin({ left: 90 });
            }

            if (fd.bottom_margin === 'auto') {
               chart.margin({ bottom: 50 });

            } else {
              chart.margin({ bottom: fd.bottom_margin });
            }

            chart_data = payload.data.chart_data ? payload.data.chart_data : payload.data;

                svg
                .datum(chart_data)
                .transition().duration(500)
                .attr('height', height)
                .attr('width', width)
                .call(chart);

                if (fd.show_markers) {
                  svg.selectAll('.nv-point')
                  .style('stroke-opacity', 1)
                  .style('fill-opacity', 1);
                }

                if (chart.yAxis !== undefined) {
                  // Hack to adjust y axis left margin to accommodate long numbers
                  const marginPad = isExplore ? width * 0.01 : width * 0.03;
                  const maxYAxisLabelWidth = getMaxLabelSize(slice.container, 'nv-y');
                  const maxXAxisLabelHeight = getMaxLabelSize(slice.container, 'nv-x');
                  chart.margin({ left: maxYAxisLabelWidth + marginPad });
                  if (fd.y_axis_label && fd.y_axis_label !== '') {
                    chart.margin({ left: maxYAxisLabelWidth + marginPad + 25 });
                  }
                  // Hack to adjust margins to accommodate long axis tick labels.
                  // - has to be done only after the chart has been rendered once
                  // - measure the width or height of the labels
                  // ---- (x axis labels are rotated 45 degrees so we use height),
                  // - adjust margins based on these measures and render again
                  if (isTimeSeries && vizType !== 'bar') {
                    const chartMargins = {
                      bottom: maxXAxisLabelHeight + marginPad,
                      right: maxXAxisLabelHeight + marginPad,
                    };

                    if (vizType === 'dual_line') {
                      const maxYAxis2LabelWidth = getMaxLabelSize(slice.container, 'nv-y2');
                      // use y axis width if it's wider than axis width/height
                      if (maxYAxis2LabelWidth > maxXAxisLabelHeight) {
                        chartMargins.right = maxYAxis2LabelWidth + marginPad;
                      }
                    }

                    // apply margins
                    chart.margin(chartMargins);
                  }
                  if (fd.x_axis_label && fd.x_axis_label !== '' && chart.xAxis) {
                    chart.margin({ bottom: maxXAxisLabelHeight + marginPad + 25 });
                  }

                  // render chart

                    svg
                    .datum(chart_data)
                    .transition().duration(500)
                    .attr('height', height)
                    .attr('width', width)
                    .call(chart);

                }

                // on scroll, hide tooltips. throttle to only 4x/second.
                $(window).scroll(throttle(hideTooltips, 250));

                return chart;

  };

  hideTooltips();

    nv.addGraph(drawGraph);
}

module.exports = nvd3VisExtended;