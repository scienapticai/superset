/* eslint-disable react/no-danger */
import React from "react";
import PropTypes from "prop-types";
import {DropdownButton, MenuItem } from "react-bootstrap";
import {fetchDownloadOptions} from './../support_utils.js';

var saveAsPNG = require('save-svg-as-png');

const propTypes = {
    slice: PropTypes.object.isRequired,
    removeSlice: PropTypes.func.isRequired,
    expandedSlices: PropTypes.object,
};

function SliceCell({expandedSlices, removeSlice, slice}) {
    return (
        <div className="slice -cell" id={`${slice.slice_id}-cell`}>
            <div className="chart-header" >
                <div className="pull-right chart-controls">
                    <a className="drag" title="Move chart" data-toggle="tooltip">
                        <i className="fa fa-arrows"/>
                    </a>
                    <a className="refresh" title="Force refresh data" data-toggle="tooltip">
                        <i className="fa fa-repeat"/>
                    </a>
                    <a href={slice.edit_url} title="Edit chart" data-toggle="tooltip">
                        <i className="fa fa-pencil"/>
                    </a>
                    {slice.description &&
                    <a title="Toggle chart description">
                        <i
                            className="fa fa-info-circle slice_info"
                            title={slice.description}
                            data-toggle="tooltip"
                        />
                    </a>
                    }
                    {fetchDownloadOptions(slice.form_data.viz_type).indexOf('png')>=0 &&
                      <a className="download-data-as-png" data-toggle="tooltip" title="Download as PNG">
                          <i id={"download-as-png-icon-"+slice.slice_id} className="fa fa-file-image-o" onClick={() => {saveAsPNG.saveSvgAsPng($("#slice_"+slice.slice_id.toString()).find('svg')[0], slice.slice_name+".png", { backgroundColor: 'white'});}}></i>
                      </a>

                    }
                    <a
                        className="remove-chart"
                        title="Remove chart from dashboard"
                        data-toggle="tooltip"
                    >
                        <i
                            className="fa fa-close"
                            onClick={() => {
                                removeSlice(slice.slice_id);
                            }}
                        />
                    </a>

                </div>
                <a className="header" onClick={(e) => {
                    e.stopPropagation();
                }} href={slice.slice_url} title="Explore chart" data-toggle="tooltip">
                    {slice.slice_name}
                </a>
            </div>
            <div
                className="slice_description bs-callout bs-callout-default"
                style={
                    expandedSlices &&
                    expandedSlices[String(slice.slice_id)] ? {} : {display: 'none'}
                }
                dangerouslySetInnerHTML={{__html: slice.description_markeddown}}
            />
            <div className="row chart-container">
                <input type="hidden" value="false"/>
                <div id={'token_' + slice.slice_id} className="token col-md-12">
                    <img
                        src="/static/assets/images/loading.gif"
                        className="loading"
                        alt="loading"
                    />
                    <div
                        id={'con_' + slice.slice_id}
                        className={`slice_container ${slice.form_data.viz_type}`}
                    />
                </div>
            </div>
        </div>
    );
}

SliceCell.propTypes = propTypes;

export default SliceCell;
