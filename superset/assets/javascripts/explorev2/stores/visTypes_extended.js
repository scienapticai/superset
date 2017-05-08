import visTypes from './visTypes'
import $ from 'jquery';

const newVisTypes = {
    UkViz:{
      label: 'UKViz',
        controlPanelSections: [
        {
            label: 'Map Parameters',
            controlSetRows:[
                ['subregion'],
                ['metrics'],
            ]
        }
        ]
      },
}


$.extend(visTypes, newVisTypes);

export default visTypes;