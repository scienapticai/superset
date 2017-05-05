from superset import app
import json
import os
def getEntryFileName(fileName,type):
    dir = os.path.dirname(__file__)
    pathForAssetsJson = os.path.join(dir,'static/assets/assets.json')
    with open(pathForAssetsJson) as data_file:
        data = json.load(data_file)
        return data[fileName][type]

app.jinja_env.globals.update(getEntryFileName=getEntryFileName)