import React from 'react';
import PropTypes from 'prop-types';

import Controls from './Controls';

const propTypes = {
  dashboard: PropTypes.object,
};
const defaultProps = {
};

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const dashboard = this.props.dashboard;
    return (
      <div className="title">
        <div className="pull-left">

          <h1>
            {dashboard.dashboard_title} &nbsp;
            <span is class="favstar" class_name="Dashboard" obj_id={dashboard.id} />
          </h1>
        </div>
        <div className="pull-right">
            <div style={{ marginBottom: '25px'}}>
                <img className="logo_class" id="logo_id" src="/static/assets/images/aflac.png" width="120" height="40" />
            </div>
              {!this.props.dashboard.standalone_mode &&
              <Controls dashboard={dashboard} />
            }

        </div>
        <div className="clearfix" />
      </div>

    );
  }
}
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
