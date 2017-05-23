/* eslint-disable  no-use-before-define */
import $ from 'jquery';
import d3 from 'd3';
import cloudLayout from 'd3-cloud';
import { category21 } from '../javascripts/modules/colors';
import {customColor} from "../javascripts/customColors"
import { SIZE_FROM, SIZE_TO } from '../javascripts/explorev2/stores/controls_extended';




function wordCloudChart(slice, payload) {
  const chart = d3.select(slice.selector);
  const fd = slice.formData;

    const data = payload.data.map(item => $.extend(true,{},item));

    const size_from = (isNaN(fd.size_from) ? SIZE_FROM[0] : fd.size_from).toString();
    const size_to = (isNaN(fd.size_to) ? SIZE_TO[0] : fd.size_to).toString();
    const range = [size_from, size_to];

  const rotation = fd.rotation;
  let fRotation;
  if (rotation === 'square') {
    fRotation = () => Math.floor((Math.random() * 2) * 90);
  } else if (rotation === 'flat') {
    fRotation = () => 0;
  } else {
    fRotation = () => Math.floor(((Math.random() * 6) - 3) * 30);
  }
  const size = [slice.width(), slice.height()];

  const scale = d3.scale.linear()
  .range(range)
  .domain(d3.extent(data, function (d) {
    return d.size;
  }));

  function draw(words) {
    chart.selectAll('*').remove();

    var colorConditionalStatement = slice.formData.color ? slice.formData.color.length : slice.formData.color;

    chart.append('svg')
    .attr('width', layout.size()[0])
    .attr('height', layout.size()[1])
    .append('g')
    .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .style('font-size', d => d.size + 'px')
    .style('font-family', 'Impact')
    .style('fill', colorConditionalStatement ? d => customColor(d.text, slice.formData.color) : d => category21(d.text))
    .attr('text-anchor', 'middle')
    .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
    .text(d => d.text);
  }

  const layout = cloudLayout()
  .size(size)
  .words(data)
  .padding(5)
  .rotate(fRotation)
  .font('serif')
  .fontSize(d => scale(d.size))
  .on('end', draw);

  layout.start();
}

module.exports = wordCloudChart;
