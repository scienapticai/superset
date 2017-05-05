from superset import viz
from superset.viz import viz_types_list
from superset.viz import NVD3TimeSeriesViz
from flask_babel import lazy_gettext as _
from superset.viz import BaseViz
from collections import OrderedDict, defaultdict
from superset.viz import viz_types
from superset import app
import simplejson as json
config = app.config

class UkViz(BaseViz):
    viz_type = "UkViz"
    verbose_name = _("UkViz View")
    credits = '<a href="https://bost.ocks.org/mike/map/">MAP</a>'
    is_timeseries = False

    def query_obj(self):
        d = super(UkViz, self).query_obj()
        subregion = self.form_data.get('subregion')
        metrics = self.form_data.get('metrics')

        if not subregion:
            subregion = []
        if not subregion:
            raise Exception("Please choose sub-region data column ")
        if not metrics:
            raise Exception("Please choose at least one metric")

        somelist = []
        somelist.append(subregion)

        d['groupby'] = somelist
        return d

    def get_df(self, query_obj=None):
        df = super(UkViz, self).get_df(query_obj)
        if (
                        self.form_data.get("granularity") == "all" and
                        'timestamp' in df):
            del df['timestamp']
        return df

    def get_data(self, df):
        subregion = self.form_data.get('subregion')
        metrics = self.form_data.get('metrics')
        data_dictionary = dict()
        i = 0
        for d in df[subregion]:
            metricValuesArray = []
            for j in range(0,len(metrics)):
                metricValuesArray.append(df[metrics[j]][i])
            data_dictionary[d] = metricValuesArray
            i = i + 1
        required_json = {
            'data_dictionary' : data_dictionary,
            'metrics' : metrics,
        }
        return required_json


viz_types_list.append(UkViz)

for v in viz_types_list:
    if v.viz_type not in config.get('VIZ_TYPE_BLACKLIST'):
        viz_types[v.viz_type] = v

#print(viz_types_list)





