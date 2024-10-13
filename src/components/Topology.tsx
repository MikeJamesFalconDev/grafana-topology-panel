import React, { Component } from 'react'

import Router from './Router';
import Link from './Link'
import Site from './Site';
import { TopologyProps, RouterProps, TopologyState, LinkProps, SiteProps } from 'types';
import { DataFrame, Field } from '@grafana/data';
import { GoogleMapsContext } from '@vis.gl/react-google-maps';


class Topology extends Component<TopologyProps,TopologyState> {
  static contextType = GoogleMapsContext;
  context!: React.ContextType<typeof GoogleMapsContext>;


  constructor(props: TopologyProps) {
    super(props)
    this.routersChanged = this.routersChanged.bind(this)
    this.getNodes(this.props.series);
    this.getLinks(this.props.series);
    // console.log('Router count: ' + this.routers.length)
    // console.log('Site count: ' + this.sites.length + ' containing ' + this.sites[0].routers.length)
    // console.log('Link count: ' + this.links.length)
  }

  state = {
    updated: Date.now()
  }

  routers:  RouterProps[]  = []
  sites:    SiteProps[]    = []
  links:    LinkProps[]    = []

  
  private getField(frame: DataFrame, name: string) {
    return frame.fields.find((field) => field.name === name)
  }

  private getRouterProps(idField: Field, titleField: Field, detailsField: Field | undefined, lat: number, lng: number, index: number): RouterProps {
    let coordinates = new google.maps.LatLng( {
      lat: lat,
      lng: lng
      }
    )
    let props: RouterProps = {
      name: idField.values[index],
      title: titleField.values[index],
      details: (detailsField)? detailsField.values[index] : '',
      coordinates: coordinates,
      options: this.props.options,
    }
    return props
  }

  private getNodes(series: DataFrame[]) {
    const frame = series.find((frame) => frame.name === 'nodes' || this.getField(frame,'latitude') && this.getField(frame,'longitude'));
    if (!frame || frame.fields.length === 0) {
      console.log('Routers frame not found')
      return
    }
    const idField     =   this.getField(frame, 'id'); 
    const titleField  =   this.getField(frame, 'title');
    const latField    =   this.getField(frame, 'latitude'); 
    const lngField    =   this.getField(frame, 'longitude')
    const detailsField =  this.getField(frame, 'details');
    if (!idField || !titleField || !latField || !lngField) {
      console.log('Missing fields: id: ' + idField + ' title: ' + titleField + ' latitude: ' + latField + ' longitude: ' + lngField)
      return
    }
    const locations = new Map<string, RouterProps|SiteProps>()
    let lat: number, lng: number, latlng: string
    let router: RouterProps
    this.sites = []
    this.routers = []
    frame.fields[0].values.forEach (
      (field, index, fields) => {
        lat = (latField.values[index])? latField.values[index]: -36
        lng = (lngField.values[index])? lngField.values[index]: -64
        latlng = lat + '_' + lng
        router = this.getRouterProps(idField, titleField, detailsField, lat, lng, index)

        if (locations.has(latlng)) {
          let existing = locations.get(latlng)
          if (existing) {
            if ('routers' in existing) {
              existing.routers.push(router)
              existing.details +=  ' ' + router.title
            } else {
              let site: SiteProps = {...router, id: this.sites.length, expanded: false, title: 'Site', details: router.title, routers: [router], routersChanged: this.routersChanged}
              let i = this.routers.indexOf(existing)
              if (index >= 0) {
                this.routers.splice(i, 1)
              }
              this.sites.push(site)
              locations.set(latlng, site)
            }
          }
        } else {
          this.routers.push(router)
          locations.set(latlng, router)
        }
      }
    );
  }

  routersChanged(site: SiteProps) {
    console.log('Routers changed')
    // TODO This is generating the following error:
    // RangeError: Maximum call stack size exceeded
    // at Function.keys (<anonymous>)
    // this.links.filter(link => site.routers.includes(link.source) || site.routers.includes(link.target)).forEach(link => link.updated = Date.now())
    const sites = this.sites.filter(mySite => mySite.id === site.id)
    const mySite = sites[0]
    mySite.expanded = !mySite.expanded
    this.setState({
      ...this.state,
      updated: Date.now()
    })
  }

  private findNode(name: String): RouterProps | undefined {
    let node = this.routers.find((curr)=> curr.name === name);
    if (!node) {
      this.sites.forEach((current) => node = current.routers.find((curr)=> curr.name === name))
    }
    return node
  }

  private getLinkProps(source: RouterProps, target: RouterProps, sourceLoadField: Field | undefined, targetLoadField: Field | undefined, index: number): LinkProps {
    return {
      name: source.title + '-' + target.title,
      source: source,
      target: target,
      load: [ (sourceLoadField)? sourceLoadField.values[index]: -1, (targetLoadField)? targetLoadField.values[index]: -1 ],
      options: this.props.options,
      updated: Date.now()
    }

  }

  private getLinks(series: DataFrame[]) {

    const frame = series.find((frame) => this.getField(frame, 'source') && this.getField(frame, 'target'));
    if (!frame || frame.fields.length === 0) {
      console.log('Links frame not found')
      return
    }

    const sourceField     = this.getField(frame, 'source');
    const targetField     = this.getField(frame, 'target');
    const sourceLoadField = this.getField(frame, 'sourceLoad');
    const targetLoadField = this.getField(frame, 'targetLoad');
    if (!sourceField || !targetField) {
      console.log('Link source or target field missing: source '+ sourceField + ' target '+ targetField);
      return
    }
    this.links = frame.fields[0].values.reduce (
      (acc, value, index) => {
        const source = this.findNode(sourceField.values[index]);
        const target = this.findNode(targetField.values[index]);
        if (source && target) {
          acc.push( this.getLinkProps(source, target, sourceLoadField, targetLoadField, index))
        } else {
          console.log('Source or Target not found: index: ' + index + '\tvalue: ' + value + '\n\tsource: '+ source + '\n\ttarget: '+target);
        }
        return acc;
      }, []
    );
  }

  render(): React.ReactNode {
    console.log('Topology render')
    const {map} = this.context!
    if (map != null) {
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(this.routers).map((router)=> bounds.extend(router.coordinates));
      Object.values(this.sites).map((site)=> bounds.extend(site.coordinates));
      map.fitBounds(bounds);
    }
    return (
      <>
      { this.routers.map((router,index)   => <Router key={index} {...router} /> ) }
      { this.sites.map((site, index)      => <Site   key={index} {...site}   /> ) }
      { this.links.map((link, index)      => <Link   key={index} {...link}   /> ) }
      </>
    )
  }
}
  
export default Topology

  
  //Nodes
  //title, id,latitude,longitude
  //Router1, 192.158.15.1,-34.763867,-58.401303
  //Router2, 192.158.15.2,-34.764615,-58.400610
  //Router3, 192.158.15.3,-34.761171,-58.400528
  
  //Edges
  //id,source,target
  //1,Router1,Router2
  //2,Router1,Router3
