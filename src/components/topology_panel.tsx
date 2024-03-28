import React from 'react';
import { PanelProps } from '@grafana/data';
import { TopologyOptions } from 'types';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
// import { APIProvider, Map } from '@vis.gl/react-google-maps'
import Topology from'components/Topology';

interface Props extends PanelProps<TopologyOptions> {}

//TODOS
// Agregar hover info en Routers y Links y onClick en Routers


export const TopologyPanel: React.FC<Props> = React.memo(({ options, data, width, height }) => {

  const { isLoaded } = useJsApiLoader ( {
    googleMapsApiKey: options.googleMapsApiKey,
    libraries: [ "geometry"]
  })

  const [map, setMap] = React.useState<google.maps.Map|null>(null)

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])


  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])


if (!data || !data.series.length) {
    return (
      <div className="panel-empty">
        <p>No data found in response</p>
      </div>
    );
  }
    const mapOptions = 
    { styles: [
        { 
          featureType: "poi.business", 
          stylers: [{ visibility: "off", }], 
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "on" }],
        },
      ],
      streetViewControl: false
    }
    
  //  const mapStyles = [{"stylers":[{"visibility":"off"}]},
  //  {"featureType":"road","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},
  //  {"featureType":"road.arterial","stylers":[{"visibility":"on"},{"color":"#fee379"}]},
  //  {"featureType":"road.highway","stylers":[{"visibility":"on"},{"color":"#fee379"}]},
  //  {"featureType":"landscape","stylers":[{"visibility":"on"},{"color":"#f3f4f4"}]},
  //  {"featureType":"water","stylers":[{"visibility":"on"},{"color":"#7fc8ed"}]},{},
  //  {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
  //  {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#83cead"}]},
  //  {"elementType":"labels","stylers":[{"visibility":"off"}]},
  //  {"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"weight":0.9},{"visibility":"off"}]}]


    // return (
    //   <APIProvider apiKey='AIzaSyCwHh8f8gKvU60bbyFKM4lvzIhwmi9ZYzg'>
    //     <Map 
    //       center={{ lat: 61, lng: -149}} zoom={10}
    //     >
    //       {/* <Topology series={data.series} map={map} options={options} /> */}
    //     </Map>
    //   </APIProvider>
    // );

    return isLoaded ? (
        <GoogleMap
          mapContainerStyle={{width: width, height: height}}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
      >
        <Topology series={data.series} map={map} options={options} />
      </GoogleMap>
  ) : <div>Error loading maps</div>;

});
TopologyPanel.displayName = "TopologyPanel"
