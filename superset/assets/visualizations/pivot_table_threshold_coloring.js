/**
 * Created by bala on 11/5/17.
 */
import 'datatables.net';
import dt from 'datatables.net-bs';
import $ from 'jquery';
import 'datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.css';
import { fixDataTableBodyHeight } from '../javascripts/modules/utils';
import './pivot_table.css';

dt(window, $);

module.exports = function (slice, payload) {
    console.log(payload);
    const container = slice.container;
    const fd = slice.formData;
    const height = container.height();

    // payload data is a string of html with a single table element
    container.html(payload.data);

    if (fd.groupby.length === 1) {
        // When there is only 1 group by column,
        // we use the DataTable plugin to make the header fixed.
        // The plugin takes care of the scrolling so we don't need
        // overflow: 'auto' on the table.
        container.css('overflow', 'hidden');
        const table = container.find('table').DataTable({
            paging: false,
            searching: false,
            bInfo: false,
            scrollY: `${height}px`,
            scrollCollapse: true,
            scrollX: true,
        });
        table.column('-1').order('desc').draw();
        fixDataTableBodyHeight(container.find('.dataTables_wrapper'), height);
    } else {
        // When there is more than 1 group by column we just render the table, without using
        // the DataTable plugin, so we need to handle the scrolling ourselves.
        // In this case the header is not fixed.
        container.css('overflow', 'auto');
        container.css('height', `${height + 10}px`);
    }

    var min_value = payload.form_data.min_value;
    var max_value = payload.form_data.max_value;

    if(min_value === '' || isNaN(min_value)){
        throw new Error('Invalid min value');
    }
    else{
        min_value = parseFloat(min_value)
    }

    if(max_value === '' || isNaN(max_value)){
        throw new Error('Invalid max value');
    }
    else{
        max_value = parseFloat(max_value)
    }

    if(min_value > max_value){
        throw new Error('Min value has to be lesser than Max value');
    }

    var color  = payload.form_data.pivot_color;

    container.find('.table tr').each(function () {
        $('td', this).each(function (index) {
            var val = $(this).text();
            if($.isNumeric(val) && !isNaN(min_value) && !isNaN(max_value)){
                if(parseFloat(val) <= max_value && parseFloat(val) >= min_value){
                    $(this).css('color', color);
                }
            }
        });
    });
};
