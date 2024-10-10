import React, { Component } from 'react';
import { TopologyPanelProps, TopologyPanelState } from 'types';
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import Topology from 'components/Topology';
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// const styles =   
// [  
//      { 
//         featureType: "poi.business", 
//         stylers: [{ visibility: "off", }], 
//       },
//       {
//         featureType: "transit",
//         elementType: "labels.icon",
//         stylers: [{ visibility: "on" }],
//       },
// ]



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
      </APIProvider>
    );

  //   if (!this.state.isLoaded) {
  //     this.loadApi()
  //     return <div>Error loading maps</div>
  //   }

  //   console.log('###################################TOPOLOGY PANEL RENDER!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //   return  (
  //       <GoogleMap
  //         mapContainerStyle={{width: this.props.width, height: this.props.height}}
  //         onLoad={this.onLoad}
  //         onUnmount={this.onUnmount}
  //         options={mapOptions}
  //     >
  //       <Topology series={this.props.data.series} options={this.props.options} map={this.state.map}/>
  //     </GoogleMap>
  //     );

  }
}
