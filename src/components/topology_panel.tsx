import React from 'react';
import { PanelProps } from '@grafana/data';
import { TopologyOptions } from 'types';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import Topology from'components/Topology';

interface Props extends PanelProps<TopologyOptions> {}

//TODOS
// Eliminar todos los landmarks
// Agregar hover info en Routers y Links y onClick en Routers


export const TopologyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const { isLoaded } =  useLoadScript({
    //googleMapsApiKey: 'AIzaSyAGmzk-ZHr54c2FAM3PWY-NVby3036C9_w',
    googleMapsApiKey: 'AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik',
  });

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])


  const onUnmount = React.useCallback(function callback(map) {
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
      ]
    }
    
//    const mapStyles = [{"stylers":[{"visibility":"off"}]},
//    {"featureType":"road","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},
//    {"featureType":"road.arterial","stylers":[{"visibility":"on"},{"color":"#fee379"}]},
//    {"featureType":"road.highway","stylers":[{"visibility":"on"},{"color":"#fee379"}]},
//    {"featureType":"landscape","stylers":[{"visibility":"on"},{"color":"#f3f4f4"}]},
//    {"featureType":"water","stylers":[{"visibility":"on"},{"color":"#7fc8ed"}]},{},
//    {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
//    {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#83cead"}]},
//    {"elementType":"labels","stylers":[{"visibility":"off"}]},
//    {"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"weight":0.9},{"visibility":"off"}]}]


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

};

//    <div
//      className={cx(
//        styles.wrapper,
//        css`
//          width: ${width}px;
//          height: ${height}px;
//        `
//      )}
//    >
//      <svg
//        className={styles.svg}
//        width={width}
//        height={height}
//        xmlns="http://www.w3.org/2000/svg"
//        xmlnsXlink="http://www.w3.org/1999/xlink"
//        viewBox={`-${width / 4} -${height / 4} ${width/2} ${height/2}`}
//      >
//        <g>
//          <circle style={{ fill: theme.colors.primary.main }} r={300} />
//        </g>
//      </svg>
//
//      <div className={styles.textBox}>
//        {options.showSeriesCount && <div>Number of series: {data.series.length}</div>}
//        <div>Text option value: {options.text}</div>
//      </div>
//    </div> 
//  );

