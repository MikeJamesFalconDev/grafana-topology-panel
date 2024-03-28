import React from 'react'

import { DataFrame } from '@grafana/data';
import { TopologyOptions} from 'types'
import Router from './Router';
import Link from './Link'
import { TopologyClass } from 'TopologyClass';


  interface TopologyProps {
    series: DataFrame[],
    map: google.maps.Map | null
    options: TopologyOptions
  }
  
  const Topology: React.FC<TopologyProps> = ({ series, map , options}) => {
    const topology = new TopologyClass(series);
    if (map != null) {
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(topology.nodes).map((node)=> bounds.extend(node.coordinates));
      map.fitBounds(bounds);
    }
    return (
      <>
      { topology.nodes.map((node)=> <Router key={node.name} node={node} options={options}/> ) }
      { topology.edges.map((edge)=> <Link key={edge.name} link={edge} options={options} /> ) }
      </>
    )
  
  }
  
  export default Topology

  
  //Nodes
  //id,latitude,longitude
  //Router1,-34.763867,-58.401303
  //Router2,-34.764615,-58.400610
  //Router3,-34.761171,-58.400528
  
  //Edges
  //id,source,target
  //1,Router1,Router2
  //2,Router1,Router3
