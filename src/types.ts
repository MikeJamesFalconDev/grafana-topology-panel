import { DataFrame, PanelData, PanelProps } from '@grafana/data';

interface LightColorThreshold {
  threshold: number,
  color: string
}

export interface TopologyOptions {
  googleMapsApiKey: string,
  nodeClickUrl: string,
  nodeIconSize: google.maps.Size // Not implemented
  showLinks: boolean,
  showLinkUsage: boolean,
  linkColor: string,
  linkWeight: number,
  linkGeodesic: boolean,
  linkOpacity: number,
  linkLight: LightColorThreshold[],
  linkLightDefault: string,
  showNodeTitles: boolean,
}

export interface TopologyPanelProps extends PanelProps<TopologyOptions> {
  options:  TopologyOptions
  data:     PanelData
  width:    number
  height:   number
}

export interface TopologyPanelState {
}


export interface TopologyProps {
  series: DataFrame[],
  options: TopologyOptions
}

export interface TopologyState {
  updated: number
}


export interface RouterProps {
  name: string,
  title: string,
  details: string,
  coordinates: google.maps.LatLng,
  options: TopologyOptions,
}

export interface SiteProps extends RouterProps {
  id: number
  routers: RouterProps[]
  expanded: boolean
  routersChanged: (site: SiteProps) => void
}


export interface LinkProps {
  name: string
  source: RouterProps,
  target: RouterProps,
  load: number[]
  options: TopologyOptions
  updated: number
}

export interface LinkState {
  showPopup: boolean,
  highlight: boolean
}


export interface Offset {
  x: number
  y: number
}


export const RED = '#db0404'
export const YELLOW = '#f0e805'
export const GREY = '#6b6b6a'
export const GREEN = '#32a836'
export const BLUE = '#2355a1'
