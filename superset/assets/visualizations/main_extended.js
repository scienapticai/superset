import * as vizMap from './main.js'

vizMap['default']['UkViz'] = require('./uk_vis.js');
vizMap['default']['LinePlusBarChartViz'] = require('./nvd3_vis_extended.js');
vizMap['default']['BubbleWithFilterViz'] = require('./nvd3_vis_extended.js');
vizMap['default']['SunburstIntensityViz'] = require("./sunburst_intensity.js");
vizMap['default']['collapsible_force'] = require('./collapsible_force.js');
vizMap['default']['coffee_wheel'] = require('./coffee_wheel.js');

export default vizMap;
