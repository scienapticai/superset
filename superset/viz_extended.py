from superset import viz
from superset.viz import viz_types_list
from superset.viz import NVD3TimeSeriesViz
from flask_babel import lazy_gettext as _
from superset.viz import BaseViz
from collections import OrderedDict, defaultdict
from superset.viz import viz_types
from superset import app, utils

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

class CollapsibleForceViz(BaseViz):

    """An animated directed force layout graph visualization"""

    viz_type = "collapsible_force"
    verbose_name = _("Collapsible Force Layout")
    credits = 'd3noob @<a href="https://bl.ocks.org/mbostock/1062288">bl.ocks.org</a>'
    is_timeseries = False

    def query_obj(self):
        qry = super(CollapsibleForceViz, self).query_obj()
        if len(self.form_data['groupby']) < 2:
            raise Exception("Pick atleast 2 columns in Hierarchy Field")
        qry['metrics'] = [self.form_data['metric']]
        return qry

    def get_data(self, df):
        return dict(
            records=df.to_dict(orient="records"),
            columns=list(df.columns),
        )

class CoffeeWheelViz(BaseViz):

    """A multi level CoffeeWheel chart"""

    viz_type = "coffee_wheel"
    verbose_name = _("Coffee Wheel")
    is_timeseries = False
    credits = (
        'Kerry Rodden '
        '@<a href="https://bl.ocks.org/kerryrodden/7090426">bl.ocks.org</a>')

    def query_obj(self):
        d = super(CoffeeWheelViz, self).query_obj()
        fd = self.form_data

        if fd.get('groupby'):
            d['columns'] = fd.get('groupby')
            d['groupby'] = []
            order_by_cols = fd.get('order_by_cols') or []
            d['orderby'] = [json.loads(t) for t in order_by_cols]
        else:
            raise Exception("Invalid Input : Enter inputs to Hierarchial field ")
        return d

    def get_df(self, query_obj=None):
        df = super(CoffeeWheelViz, self).get_df(query_obj)
        if (
                        self.form_data.get("granularity") == "all" and
                        DTTM_ALIAS in df):
            del df[DTTM_ALIAS]
        return df

    def get_data(self, df):
        # df = self.get_df()
        return dict(
            records=df.to_dict(orient="records"),
            columns=list(df.columns),
            #colors=self.form_data.get("colors"),
        )

    def json_dumps(self, obj):
        return json.dumps(obj, default=utils.json_iso_dttm_ser)


class PivotTableThreholdColoringViz(BaseViz):

    """A pivot table view, define your rows, columns and metrics"""

    viz_type = "pivot_table_threshold_coloring"
    verbose_name = _("Pivot Table Threshold Coloring")
    is_timeseries = False

    def query_obj(self):
        d = super(PivotTableThreholdColoringViz, self).query_obj()
        groupby = self.form_data.get('groupby')
        columns = self.form_data.get('columns')
        metrics = self.form_data.get('metrics')
        if not columns:
            columns = []
        if not groupby:
            groupby = []
        if not groupby:
            raise Exception("Please choose at least one \"Group by\" field ")
        if not metrics:
            raise Exception("Please choose at least one metric")
        if (
                    any(v in groupby for v in columns) or
                    any(v in columns for v in groupby)):
            raise Exception("groupby and columns can't overlap")

        d['groupby'] = list(set(groupby) | set(columns))
        return d

    def get_data(self, df):
        if (
                        self.form_data.get("granularity") == "all" and
                        DTTM_ALIAS in df):
            del df[DTTM_ALIAS]
        df = df.pivot_table(
            index=self.form_data.get('groupby'),
            columns=self.form_data.get('columns'),
            values=self.form_data.get('metrics'),
            aggfunc=self.form_data.get('pandas_aggfunc'),
            margins=True,
        )
        return df.to_html(
            na_rep='',
            classes=(
                "dataframe table table-striped table-bordered "
                "table-condensed table-hover").split(" "))



viz_types_list.append(UkViz)
viz_types_list.append(LinePlusBarChartViz)
viz_types_list.append(BubbleWithFilterViz)
viz_types_list.append(SunburstIntensityViz)
viz_types_list.append(CollapsibleForceViz)
viz_types_list.append(CoffeeWheelViz)
viz_types_list.append(PivotTableThreholdColoringViz)

for v in viz_types_list:
    if v.viz_type not in config.get('VIZ_TYPE_BLACKLIST'):
        viz_types[v.viz_type] = v

#print(viz_types_list)





