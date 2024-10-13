import React, { Component } from 'react'
import { BLUE, Offset, SiteProps } from 'types';
import site_icon from 'img/building.svg'
import Router from './Router';
import {AdvancedMarker, GoogleMapsContext, InfoWindow} from '@vis.gl/react-google-maps';
import { Circle } from './circle';


class Site extends Component<SiteProps> {
    static contextType = GoogleMapsContext;
    context!: React.ContextType<typeof GoogleMapsContext>;

    state = {
        showPopup: false,
        highlight: false,
        r: 100
    }

    handleClick = (e: google.maps.MapMouseEvent) => {
        console.log('handleClick start')
        this.props.routersChanged(this.props)        
        console.log('handleClick end')
    }

    getTitleLabel(): google.maps.MarkerLabel {
        let title = ''
        this.props.routers.forEach((child) => title += child.title + ' ')
        return {
          text: title,
          fontSize: '10'
        }
      }
    
      getChildCoords(index: number, count: number): google.maps.LatLng {
        if (this.props.expanded === false) {
            return this.props.coordinates
        }

        const r = 100
        const alfa = 2 * Math.PI / count
        let offset: Offset = {
            x: r * Math.sin(alfa * index),
            y: r * Math.cos(alfa * index)
          }
          return this.getCoordinates(offset)
      }

      getCoordinates(offset: Offset): google.maps.LatLng {
        if (!this.context) {
            return this.props.coordinates
        }
        const {map} = this.context!
        const zoom: number| undefined = map?.getZoom()
        const projection: google.maps.Projection | undefined = map?.getProjection()
        if (!map) {
            return this.props.coordinates
        }
        if (!projection || !zoom) {
            return this.props.coordinates
        }
        let loc: google.maps.Point | null = projection.fromLatLngToPoint(this.props.coordinates)
        if (loc === null) {
            return this.props.coordinates
        }
        const newLoc = new window.google.maps.Point(loc.x + (offset.x/(2^(zoom)))/2048, loc.y + (offset.y/(2^(zoom)))/2048)
        const displacedCoords = projection.fromPointToLatLng(newLoc)
        if (displacedCoords !== null) {
            return displacedCoords
        }
        return this.props.coordinates
      }


      updateOffsets() {
        let count = this.props.routers.length
        for(let i=0; i < count; i++) {
            this.props.routers[i].coordinates = this.getChildCoords(i,count)
        }
      }

      render(): React.ReactNode {
        console.log('Site render: ' + this.props.routers.length + ' expanded: ' + this.props.expanded)
        this.updateOffsets()

        return (
            <>
            {!this.props.expanded && 
            <AdvancedMarker 
                position={this.props.coordinates}
                onClick={this.handleClick}
            >
                <img src={site_icon} width={80} height={80} style={{position: 'relative', top: 30, left: 0}}/>
                {this.state.showPopup? (
                    <InfoWindow headerContent={<h5>{this.props.title}</h5>} position={this.props.coordinates} pixelOffset={[0,-20]}>
                        <h5>{this.props.details}</h5>
                    </InfoWindow>
                ): <></>}
            </AdvancedMarker>}
            { this.props.expanded && <Circle fillOpacity={0.15} fillColor={BLUE} strokeColor={BLUE} strokeOpacity={0.5} strokeWeight={1} onClick={this.handleClick} center={this.props.coordinates} radius={5*this.state.r}/>}
            { this.props.expanded && this.props.routers.map((router, index) => <Router key={index} {...router} /> ) }
            </>
        )

    }
}

export default Site;
