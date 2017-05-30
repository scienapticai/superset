import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import InfoTooltipWithTrigger from '../../components/InfoTooltipWithTrigger';
import { slugify } from "../../modules/utils"

const propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
  index: PropTypes.number,
};

const defaultProps = {
  label: null,
  description: null,
  tooltip: null,
  index: 0,
};

export default class ControlPanelSection extends React.Component {
  renderHeader() {
    const { label, tooltip } = this.props;
    let header;
    if (label) {
      header = (
        <div>
          {label} &nbsp;
          {tooltip && <InfoTooltipWithTrigger label={label} tooltip={tooltip} />}
        </div>
      );
    }
    return header;
  }

  collapseStatus() {
      const {label, index} = this.props;
      if (index != 0) {
          return true;
      }
      return false;
  }

  render(){
    const label = this.props.label || "None";
    let collapseStatus = this.collapseStatus() ? " collapse" : " collapse in";
    return (
        <div className="panel-group">
          <div className="panel panel-default">
            <div className="panel-heading panel-hover b-p75">
              <h4 className="panel-title  no-bor-bot">
                <a className="no-text-decor" data-toggle="collapse" href={"#"+slugify(label)}>{this.renderHeader()}</a>
              </h4>
            </div>
            <div id={slugify(label)} className={"top-bor panel-collapse"+collapseStatus}>
                <div className="panel-body top-bor">
                    {this.props.children}
                </div>
            </div>
          </div>
        </div>
    );
  }
}

ControlPanelSection.propTypes = propTypes;
ControlPanelSection.defaultProps = defaultProps;

