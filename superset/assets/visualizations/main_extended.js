import * as vizMap from './main.js'

vizMap['default']['UkViz'] = require('./uk_vis.js');
vizMap['default']['LinePlusBarChartViz'] = require('./nvd3_vis_extended.js');
vizMap['default']['BubbleWithFilterViz'] = require('./nvd3_vis_extended.js');
vizMap['default']['SunburstIntensityViz'] = require("./sunburst_intensity.js");

export default vizMap;