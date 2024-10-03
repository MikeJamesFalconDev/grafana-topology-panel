import React, { Component } from 'react'

import Router from './Router';
import Link from './Link'
import Site from './Site';
import { TopologyProps, RouterProps, EdgeType, LinkProps, TopologyState } from 'types';
import { DataFrame, Field } from '@grafana/data';


class Topology extends Component<TopologyProps,TopologyState> {
  
  constructor(props: TopologyProps) {
    super(props)
    this.addRouters = this.addRouters.bind(this)
    this.removeRouters = this.removeRouters.bind(this)
    this.getNodes(this.props.series);
    this.getLinks(this.props.series);
    console.log('Router count: ' + this.routers.length)
    console.log('Site count: ' + this.sites.length + ' containing ' + this.sites[0].props.routers.length)
    console.log('Link count: ' + this.links.length)

  }

  state: TopologyState = {
    expandedRouters: []
  }

  routers:  Router[]  = []
  sites:    Site[]    = []
  links:    Link[]    = []

  
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
      routers: [],
      getMap: this.props.getMap
    }
    return props
  }

  addRouters(routers: Router[]) {
    routers.concat(this.state.expandedRouters)
    this.setState({
      expandedRouters: routers
    })
  }

  removeRouters(routers: Router[]) {
    let newArr: Router[] = []
    newArr.concat(this.state.expandedRouters.filter(expRouter => routers.indexOf(expRouter) === -1))
    this.setState({expandedRouters: newArr})
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
    const locations = new Map<string, Router|Site>()
    let lat: number, lng: number, latlng: string
    let router: Router
    this.sites = []
    this.routers = []
    frame.fields[0].values.forEach (
      (field, index, fields) => {
        lat = (latField.values[index])? latField.values[index]: -36
        lng = (lngField.values[index])? lngField.values[index]: -64
        latlng = lat + '_' + lng
        router = new Router(this.getRouterProps(idField, titleField, detailsField, lat, lng, index))

        if (locations.has(latlng)) {
          let existing = locations.get(latlng)
          if (existing) {
            if (existing instanceof Site) {
              existing.add(router)
            } else {
              let siteProps = {...router.props, addRouters: this.addRouters, removeRouters: this.removeRouters}
              let site: Site = new Site(siteProps)
              site.add(router)
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

  private findNode(name: String): Router | undefined {
    let node = this.routers.find((curr)=> curr.props.name === name);
    if (!node) {
      this.sites.forEach((current) => node = current.props.routers.find((curr)=> curr.props.name === name))
    }
    return node
  }

  private getLinkProps(source: Router, target: Router, sourceLoadField: Field | undefined, targetLoadField: Field | undefined, index: number): LinkProps {
    let edgeType: EdgeType = {
      name: source.props.title + '-' + target.props.title,
      source: source,
      target: target,
      load: [ (sourceLoadField)? sourceLoadField.values[index]: -1, (targetLoadField)? targetLoadField.values[index]: -1 ]
    }
    return {
      link: edgeType,
      options: this.props.options
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
          acc.push( new Link(this.getLinkProps(source, target, sourceLoadField, targetLoadField, index)))
        } else {
          console.log('Source or Target not found: index: ' + index + '\tvalue: ' + value + '\n\tsource: '+ source + '\n\ttarget: '+target);
          console.log(sourceField.values[index])
        }
        return acc;
      }, []
    );
  }




  render(): React.ReactNode {
    console.log('Topology render')
    const map = this.props.getMap()
    if (map != null) {
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(this.routers).map((router)=> bounds.extend(router.props.coordinates));
      Object.values(this.sites).map((site)=> bounds.extend(site.props.coordinates));
      map.fitBounds(bounds);
    }
    console.log("Expanded router count " + this.state.expandedRouters.length)
    return (
      <div>
      { this.routers.map((router, index) => <Router key={index} {...router.props} />) }
      { this.state.expandedRouters.map((router, index) => <Router key={'e'+index} {...router.props} />) }
      { this.sites.map((site, index) => <Site key={index} {...site.props} />) }
      { this.links.map((link, index) => <Link key={index} {...link.props} />) }
      </div>
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
