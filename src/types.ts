import { DataFrame } from '@grafana/data';
import Router from './components/Router'

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

export type EdgeType = {
  name: string
  source: Router,
  target: Router,
  load: number[]
}

export interface TopologyProps {
  series: DataFrame[],
  options: TopologyOptions
  getMap: () => google.maps.Map | null
}

export interface TopologyState {
  expandedRouters:  Router[],
}


export interface RouterProps {
  name: string,
  title: string,
  details: string,
  coordinates: google.maps.LatLng,
  options: TopologyOptions,
  routers: Router[]
  getMap: () => google.maps.Map | null
}

export interface SiteProps extends RouterProps {
  addRouters: (routers: Router[]) => void
  removeRouters: (routers: Router[]) => void
}


export interface LinkProps {
  link: EdgeType
  options: TopologyOptions
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
