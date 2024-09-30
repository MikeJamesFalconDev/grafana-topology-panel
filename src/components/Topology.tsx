import React from 'react'

import Router from './Router';
import Link from './Link'
import { TopologyClass } from 'TopologyClass';
import Site from './Site';
import { TopologyProps } from 'types';


  const Topology: React.FC<TopologyProps> = ({ series, map , options}) => {
    const topology = new TopologyClass(series);
    if (map != null) {
      const bounds = new window.google.maps.LatLngBounds();
      Object.values(topology.nodes).map((node)=> bounds.extend(node.coordinates));
      map.fitBounds(bounds);
    }
    return (
      <>
      { topology.nodes.map((node)=> 
      { if (node.more.length === 1) 
        {
          console.log('Including Router coordinates ' + JSON.stringify(node.coordinates));
          return <Router key={node.name} node={node} options={options}/>;  
        } else {
          console.log('Including Site coordinates ' + JSON.stringify(node.coordinates));
          return <Site key={node.name} node={node} options={options}/>  
        }
       })
      }
      { topology.edges.map((edge)=> <Link key={edge.name} link={edge} options={options} /> ) }
      </>
    )
  
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
