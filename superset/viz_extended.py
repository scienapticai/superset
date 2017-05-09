from superset import viz
from superset.viz import viz_types_list
from superset.viz import NVD3TimeSeriesViz
from flask_babel import lazy_gettext as _
from superset.viz import BaseViz
from collections import OrderedDict, defaultdict
# from superset.forms import FormFactory
from superset.viz import viz_types
from superset import app
import simplejson as json
config = app.config


# class CollapsibleForceViz(BaseViz):
#
#     """An animated directed force layout graph visualization"""
#
#     viz_type = "collapsible_force"
#     verbose_name = _("Collapsible Force Layout")
#     credits = 'd3noob @<a href="https://bl.ocks.org/mbostock/1062288">bl.ocks.org</a>'
#     is_timeseries = False
#
#     def query_obj(self):
#         qry = super(CollapsibleForceViz, self).query_obj()
#         if len(self.form_data['groupby']) < 2:
#             raise Exception("Pick atleast 2 columns in Hierarchy Field")
#         qry['metrics'] = [self.form_data['metric']]
#         return qry
#
#     def get_data(self, df):
#         return dict(
#             records=df.to_dict(orient="records"),
#             columns=list(df.columns),
#         )
#
#
# viz_types_list.append(CollapsibleForceViz)
#
# for v in viz_types_list:
#     if v.viz_type not in config.get('VIZ_TYPE_BLACKLIST'):
#         viz_types[v.viz_type] = v

# if LinePlusBarChartViz.viz_type not in config.get('VIZ_TYPE_BLACKLIST'):
#     # if config.get('CURRENT_CLIENT') == 'barc' :
#     viz_types[LinePlusBarChartViz.viz_type] = LinePlusBarChartViz
#     viz_types[UkViz.viz_type] = UkViz
#     viz_types[UsaViz.viz_type] = UsaViz
#     viz_types[PivotTableColourViz.viz_type] = PivotTableColourViz
#     viz_types[SunburstIntensityViz.viz_type] = SunburstIntensityViz
#     viz_types[BubbleWithFilterViz.viz_type] = BubbleWithFilterViz
#     #viz_types[]





