import { PanelPlugin } from '@grafana/data';
import { BLUE, GREEN, GREY, RED, TopologyOptions, YELLOW } from './types';
import { TopologyPanel } from './components/topology_panel';

export const plugin = new PanelPlugin<TopologyOptions>(TopologyPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'showNodeTitles',
      name: 'Show node titles',
      defaultValue: true,
    })
    .addTextInput({
      path: 'nodeClickUrl',
      name: 'URL to open when a node is clicked. Node id can be used by including ${id} or title by including ${title} in the URL. If the URL does not start with http:// or https:// it is considered relative to grafana.'
    })
    .addBooleanSwitch({
      path: 'showLinks',
      name: 'Show links between nodes',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'linkWeight',
      name: 'Link Weight',
      defaultValue: 3,
    })
    .addBooleanSwitch({
      path: 'linkGeodesic',
      name: 'Show links as geodesic lines',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'linkOpacity',
      name: 'Link Opacity',
      defaultValue: 0.5,
    })
    .addBooleanSwitch({
      path: 'showLinkUsage',
      name: 'Show link usage',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'linkColor',
      name: 'Link Color',
      defaultValue: GREY,
    })
    .addNumberInput( {
      path: 'linkLight[0].threshold',
      name: 'Highest Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "Highest Link Color". Range 0-1',
      defaultValue: 0.7
    })
    .addColorPicker({
      path: 'linkLight[0].color',
      name: 'Highest Link Color',
      description: 'If the link utilization exeeds "Highest Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: RED,
    })
    .addNumberInput( {
      path: 'linkLight[1].threshold',
      name: 'High Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "High Link Color". Range 0-1',
      defaultValue: 0.5
    })
    .addColorPicker({
      path: 'linkLight[1].color',
      name: 'High Link Color',
      description: 'If the link utilization exeeds "High Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: YELLOW,
    })
    .addNumberInput( {
      path: 'linkLight[2].threshold',
      name: 'Normal Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "Normal Link Color". Range 0-1',
      defaultValue: 0.5
    })
    .addColorPicker({
      path: 'linkLight[2].color',
      name: 'Normal Link Color',
      description: 'If the link utilization exeeds "Normal Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: BLUE,
    })
    .addNumberInput( {
      path: 'linkLight[3].threshold',
      name: 'Normal Link Threshold',
      description: 'This value will normally be 0. If set to a higher value and the link load does not exceed it, "Default Link Color" is used. If the link utilization exeeds this value, the light on the link will turn "Low Link Color". Range 0-1',
      defaultValue: 0
    })
    .addColorPicker({
      path: 'linkLight[3].color',
      name: 'Low Link Color',
      description: 'If the link utilization is below "Normal Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: GREEN,
    })
    .addColorPicker({
      path: 'linkLightDefault',
      name: 'Default Link Color',
      description: 'Only used when none of the prevous thresholds are reached. Usually only if "Low Link Color" is higher than the utilization. Use HTML hash color values',
      defaultValue: GREEN,
    })
  });


//    .addTextInput({
//      path: 'text',
//      name: 'Simple text option',
//      description: 'Description of panel option',
//      defaultValue: 'Default value of text input option',
//    })
//    .addRadio({
//      path: 'seriesCountSize',
//      defaultValue: 'sm',
//      name: 'Series counter size',
//      settings: {
//        options: [
//          {
//            value: 'sm',
//            label: 'Small',
//          },
//          {
//            value: 'md',
//            label: 'Medium',
//          },
//          {
//            value: 'lg',
//            label: 'Large',
//          },
//        ],
//      },
//      showIf: (config) => config.showSeriesCount,
//    });
//});
