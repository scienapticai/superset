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


class LinePlusBarChartViz(NVD3TimeSeriesViz):
    viz_type = "LinePlusBarChartViz"
    verbose_name = _("NVD3 - Line plus bar Chart")
    sort_series = False
    is_timeseries = True

    def query_obj(self):
        d = super(LinePlusBarChartViz, self).query_obj()
        fd = self.form_data
        if len(d['metrics']) < 2:
            raise Exception("Select at least two metrics, one for line and one for bar")
        result = [bar_metric for bar_metric in d['metrics'] if bar_metric == fd.get('Bar_Metric') ]
        if(len(result) == 0):
            raise Exception("Metrics should contain Bar_Metric")
        return d


class BubbleWithFilterViz(BaseViz):

    """Based on the NVD3 bubble chart"""

    viz_type = "BubbleWithFilterViz"
    verbose_name = _("BubbleWithFilterViz Chart")
    is_timeseries = False

    def query_obj(self):
        form_data = self.form_data
        d = super(BubbleWithFilterViz, self).query_obj()
        self.x_metric = form_data.get('x')
        self.y_metric = form_data.get('y')
        self.z_metric = form_data.get('size')
        self.entity = form_data.get('entity')
        self.series = form_data.get('series')
        self.x_ticks = form_data.get('bubble_x_ticks')
        self.y_ticks = form_data.get('bubble_y_ticks')

        d['metrics'] = [
            self.z_metric,
            self.x_metric,
            self.y_metric,
        ]

        d['extras']['only_select_columns'] = list({form_data.get('entity'), form_data.get('series') }) #, form_data.get('all_columns_x'), form_data.get('all_columns_y') form_data.get('bubble_filter')
        if self.x_ticks and self.x_ticks != 'None':
            d['extras']['only_select_columns'].append(self.x_ticks)
        if self.y_ticks and self.y_ticks != 'None':
            d['extras']['only_select_columns'].append(self.y_ticks)
        available_metrics = []
        for a, b in self.datasource.metrics_combo:
            available_metrics.append(a)
        return d

    def get_df(self, query_obj=None):
        df = super(BubbleWithFilterViz, self).get_df(query_obj)
        df = df.fillna(0)
        df['x'] = df[[self.x_metric]]
        df['y'] = df[[self.y_metric]]
        df['size'] = df[[self.z_metric]]
        df['shape'] = 'circle'
        print(df)
        df['group'] = df[[self.series]]
        if self.x_ticks and self.x_ticks != 'None':
            df['x_ticks'] = df[self.x_ticks]
        if self.y_ticks and self.y_ticks != 'None':
            df['y_ticks'] = df[self.y_ticks]
        return df

    def get_data(self, df):
        series = defaultdict(list)
        if 'x_ticks' in df:
            x_ticks_df = df[['x', 'x_ticks']]
            x_ticks_df = x_ticks_df.drop_duplicates().reset_index()

        if 'y_ticks' in df:
            y_ticks_df = df[['y', 'y_ticks']]
            y_ticks_df = y_ticks_df.drop_duplicates().reset_index()
        for row in df.to_dict(orient='records'):
            series[row['group']].append(row)
        chart_data = []

        x_ticks_map = {}
        y_ticks_map = {}

        if 'x_ticks' in df:
            for j in range(0,len(x_ticks_df)):
                x_ticks_map[x_ticks_df['x'][j]] = x_ticks_df['x_ticks'][j]

        if 'y_ticks' in df:
            for j in range(0,len(y_ticks_df)):
                y_ticks_map[y_ticks_df['y'][j]] = y_ticks_df['y_ticks'][j]
        for k, v in series.items():
            chart_data.append({
                'key': k,
                'values': v})
        required_json = {
            "chart_data":chart_data,
            "x_ticks_map":x_ticks_map,
            "y_ticks_map":y_ticks_map
        }

        return required_json

class SunburstIntensityViz(BaseViz):

    """A multi level sunburst chart"""

    viz_type = "SunburstIntensityViz"
    verbose_name = _("SunburstIntensityViz")
    is_timeseries = False
    credits = (
        'Kerry Rodden '
        '@<a href="https://bl.ocks.org/kerryrodden/7090426">bl.ocks.org</a>')

    def get_df(self, query_obj=None):
        df = super(SunburstIntensityViz, self).get_df(query_obj)
        return df

    def get_data(self,df):
        cols = self.form_data.get('groupby')
        metric = self.form_data.get('metric')
        secondary_metric = self.form_data.get('secondary_metric')
        if metric == secondary_metric:
            ndf = df[cols]
            ndf['m1'] = df[metric]
            ndf['m2'] = df[metric]
        else:
            cols += [
                self.form_data['metric'], self.form_data['secondary_metric']]
            ndf = df[cols]
        return json.loads(ndf.to_json(orient="values"))  # TODO fix this nonsense

    def query_obj(self):
        qry = super(SunburstIntensityViz, self).query_obj()
        qry['metrics'] = [
            self.form_data['metric'], self.form_data['secondary_metric']]
        return qry


viz_types_list.append(UkViz)
viz_types_list.append(LinePlusBarChartViz)
viz_types_list.append(BubbleWithFilterViz)
viz_types_list.append(SunburstIntensityViz)


for v in viz_types_list:
    if v.viz_type not in config.get('VIZ_TYPE_BLACKLIST'):
        viz_types[v.viz_type] = v

#print(viz_types_list)





