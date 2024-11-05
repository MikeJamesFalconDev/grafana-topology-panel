import { PanelPlugin } from '@grafana/data';
import { BLUE, GREEN, GREY, RED, TopologyOptions, YELLOW } from './types';
import { TopologyPanel } from './components/topology_panel';

export const plugin = new PanelPlugin<TopologyOptions>(TopologyPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      category: ['Layers'],
      path: 'showLinks',
      name: 'Links',
      defaultValue: true,
    })
    .addBooleanSwitch({
      category: ['Layers'],
      path: 'showLinkUsage',
      name: 'Link Usage',
      defaultValue: true,
    })
    .addNumberInput({
      category: [ "Icons"],
      path: 'routerIconSize',
      name: 'Router Icon Size',
      defaultValue: 32
    })
    .addNumberInput({
      category: [ "Icons"],
      path: 'siteIconSize',
      name: 'Site Icon Size',
      defaultValue: 80
    })
    .addTextInput({
      category: [ "Google Maps"],
      path: 'googleMapsApiKey',
      name: 'Google Maps Api Key',
    })
    .addTextInput({
      category: ['General'],
      path: 'nodeClickUrl',
      name: 'URL to open when a node is clicked. Node id can be used by including ${id} or title by including ${title} in the URL. If the URL does not start with http:// or https:// it is considered relative to grafana.'
    })
    .addNumberInput({
      category: ['General'],
      path: 'siteCircleMultiplier',
      name: 'Site Circle Multiplier. Size of the circle shown when a site is expanded',
      defaultValue: 7,
    })
    .addNumberInput({
      category: ['General'],
      path: 'linkWeight',
      name: 'Link Weight',
      defaultValue: 3,
    })
    .addBooleanSwitch({
      category: ['General'],
      path: 'linkGeodesic',
      name: 'Show links as geodesic lines',
      defaultValue: true,
    })
    .addNumberInput({
      category: ['General'],
      path: 'linkOpacity',
      name: 'Link Opacity',
      defaultValue: 0.5,
    })
    .addColorPicker({
      category: ['General'],
      path: 'linkColor',
      name: 'Link Color',
      defaultValue: GREY,
    })
    .addNumberInput( {
      category: ['Link Utilization'],
      path: 'linkLight[0].threshold',
      name: 'Highest Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "Highest Link Color". Range 0-1',
      defaultValue: 0.7
    })
    .addColorPicker({
      category: ['Link Utilization'],
      path: 'linkLight[0].color',
      name: 'Highest Link Color',
      description: 'If the link utilization exeeds "Highest Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: RED,
    })
    .addNumberInput( {
      category: ['Link Utilization'],
      path: 'linkLight[1].threshold',
      name: 'High Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "High Link Color". Range 0-1',
      defaultValue: 0.5
    })
    .addColorPicker({
      category: ['Link Utilization'],
      path: 'linkLight[1].color',
      name: 'High Link Color',
      description: 'If the link utilization exeeds "High Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: YELLOW,
    })
    .addNumberInput( {
      category: ['Link Utilization'],
      path: 'linkLight[2].threshold',
      name: 'Normal Link Threshold',
      description: 'If the link utilization exeeds this value, the light on the link will turn "Normal Link Color". Range 0-1',
      defaultValue: 0.5
    })
    .addColorPicker({
      category: ['Link Utilization'],
      path: 'linkLight[2].color',
      name: 'Normal Link Color',
      description: 'If the link utilization exeeds "Normal Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: BLUE,
    })
    .addNumberInput( {
      category: ['Link Utilization'],
      path: 'linkLight[3].threshold',
      name: 'Normal Link Threshold',
      description: 'This value will normally be 0. If set to a higher value and the link load does not exceed it, "Default Link Color" is used. If the link utilization exeeds this value, the light on the link will turn "Low Link Color". Range 0-1',
      defaultValue: 0
    })
    .addColorPicker({
      category: ['Link Utilization'],
      path: 'linkLight[3].color',
      name: 'Low Link Color',
      description: 'If the link utilization is below "Normal Link Threshold", the light on the link will turn to this color. Use HTML hash color values',
      defaultValue: GREEN,
    })
    .addColorPicker({
      category: ['Link Utilization'],
      path: 'linkLightDefault',
      name: 'Default Link Color',
      description: 'Only used when none of the prevous thresholds are reached. Usually only if "Low Link Color" is higher than the utilization. Use HTML hash color values',
      defaultValue: GREEN,
    })
  });
