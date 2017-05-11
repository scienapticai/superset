/**
 * Created by sowmya on 10/5/17.
 */


// module.exports.updatePayload = function(slice,payload) {
export function updatePayload(slice,payload) {
    const vizType = slice.formData.viz_type;
    const sliceFd = slice.formData;
    const payloadData = payload.data;
    const payloadFd = payload.form_data;

    switch(vizType){
        case "bullet" :
            payloadData.markers = sliceFd.markers!='' ? sliceFd.markers.split(",").map(function(value){
                    return parseInt(value);
                }) : payloadData.markers;

            payloadData.markerLabels = sliceFd.marker_labels.split(",");

            payloadData.markerLines = sliceFd.marker_lines!='' ? sliceFd.marker_lines.split(",").map(function(value){
                    return parseInt(value);
                }) : payloadData.markerLines ;

            payloadData.markerLineLabels = sliceFd.marker_line_labels.split(",");

            payloadData.ranges = sliceFd.ranges!='' ? sliceFd.ranges.split(",").map(function(value){
                    return parseInt(value);
                }) : payloadData.ranges ;

            payloadData.rangeLabels = sliceFd.range_labels.split(",");
            return payload;


        case "collapsible_force" :
            payloadFd.link_length = sliceFd.link_length;
            payloadFd.charge = sliceFd.charge;
            payloadFd.gravity = sliceFd.gravity;
            return payload;

        case "big_number_total" :
            payloadData.subheader = sliceFd.subheader;
            return payload;

        default :
            throw new Error('Unrecognized visualization' + vizType);
    }


};

