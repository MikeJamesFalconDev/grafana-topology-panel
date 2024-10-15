import React, { Component } from 'react';
import { TopologyPanelProps, TopologyPanelState } from 'types';
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import Topology from 'components/Topology';


export class TopologyPanel extends Component<TopologyPanelProps,TopologyPanelState> {  //= React.memo(({ options, data, width, height }) => {

  displayName = "TopologyPanel"

  constructor(props: TopologyPanelProps) {
    super(props)
  }

  state = {
  }

  render(): React.ReactNode {
    console.log("Rendering topology_panel")
    if (!this.props.data || !this.props.data.series.length) {
      return (
        <div className="panel-empty">
          <p>No data found in response</p>
        </div>
      ); 
    }

    return (
      this.props.options.googleMapsApiKey?
      <APIProvider 
          apiKey={this.props.options.googleMapsApiKey} 
          libraries={["geometry"]}
      >
          <Map 
            defaultZoom= {12}
            defaultCenter={{ lat: -34.7, lng: -58.3 }}
            mapId="7c83faa6f80c2f77"
            
          >
            <Topology series={this.props.data.series} options={this.props.options} /> 
          </Map>
      </APIProvider>:<div><h1>Please configure Google API key</h1></div>
    );

  }
}
