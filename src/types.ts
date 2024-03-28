
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
  coordinates: google.maps.LatLng
}

export type EdgeType = {
  name: string,
  endpoints: String[],
  coordinates: google.maps.LatLng[],
  load: number[]
}

export const RED = '#db0404'
export const YELLOW = '#f0e805'
export const GREY = '#6b6b6a'
export const GREEN = '#32a836'
export const BLUE = '#2355a1'
