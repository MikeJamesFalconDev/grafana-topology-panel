import { DataFrame } from '@grafana/data';

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

export type NodeType = {
  name: string,
  title: string,
  details: string,
  coordinates: google.maps.LatLng,
  more: NodeType[]
}

export type EdgeType = {
  name: string,
  source: NodeType,
  target: NodeType,
  endpoints: String[],
  coordinates: google.maps.LatLng[],
  load: number[]
}

export interface TopologyProps {
  series: DataFrame[],
  map: google.maps.Map | null
  options: TopologyOptions
}


export interface RouterProps {
  node: NodeType,
  options: TopologyOptions
  offset?: Offset
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
