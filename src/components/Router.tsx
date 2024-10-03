import React, { Component } from 'react'
import { InfoWindow, Marker } from '@react-google-maps/api';
import { Offset, RouterProps } from 'types';

const router_icon = 'https://symbols.getvecta.com/stencil_240/204_router.7b208c1133.svg'

class Router extends Component<RouterProps> {
    offset: Offset = {
        x: 0,
        y: 0
    }

    constructor(props: RouterProps) {
        super(props)
        this.setOffset = this.setOffset.bind(this)
    }

    state = {
        showPopup: false,
        highlight: false,
        showTitles: false,
    }

    handleMouseOver = (e: google.maps.MapMouseEvent) => {
        this.setState({
            showPopup: true,
            highlight: true,
            showTitles: true
        })
    };

    handleMouseOut = (e: google.maps.MapMouseEvent) => {
        this.setState({
            showPopup: false,
            highlight: false,
            showTitles:false
        })
    };

    handleClick = (e: google.maps.MapMouseEvent) => {
        if (!this.props.options.nodeClickUrl) {
            return
        }
        const url = this.props.options.nodeClickUrl.replace('{name}', this.props.name).replace('{title}', this.props.title);
        console.log(`Url ${url}`)
        const win = window.open(url, '_blank')
        if (win) { 
            win.focus();
        }
    }

    getTitleLabel(text: string): google.maps.MarkerLabel {
        return {
          text: text,
          fontSize: '10'
        }
      }

      public getCoordinates(): google.maps.LatLng {
        const map: google.maps.Map | null = this.props.getMap()
        const zoom: number| undefined = map?.getZoom()
        const projection: google.maps.Projection | undefined = map?.getProjection()
        if (!projection || !this.offset || !zoom) {
            console.log('No projection or offset or zoom. Projection: ' + projection + ' Offset: ' + JSON.stringify(this.offset) + ' zoom:' + zoom + ' map: ' + JSON.stringify(map))
            return this.props.coordinates
        } else {
            let loc: google.maps.Point | null = projection.fromLatLngToPoint(this.props.coordinates)
            if (loc === null) {
                console.log('loc = null')
                return this.props.coordinates
            }
            const newLoc = new window.google.maps.Point(loc.x + (this.offset.x/(2^(zoom)))/2048, loc.y + (this.offset.y/(2^(zoom)))/2048)
            const displacedCoords = projection.fromPointToLatLng(newLoc)
            if (displacedCoords !== null) {
                console.log('Returning displaced coordinates: ' + JSON.stringify(displacedCoords))
                return displacedCoords
            } else {
                return this.props.coordinates
            }
        }
      }

      setOffset(newOffset: Offset) {
        this.offset = newOffset 
        console.log('New offset for ' + this.props.name + ': ' + JSON.stringify(this.offset))
      }

//     animation={(highlight)?google.maps.Animation.DROP:undefined}


      render(): React.ReactNode {
        console.log('Router render ' + this.props.name + ': ' + JSON.stringify(this.offset))
        const { showPopup } = this.state;

        return (
            <>
            <Marker 
                position={this.getCoordinates()} 
                icon={{
                    url:router_icon, 
                    scaledSize: new window.google.maps.Size(40, 20), 
                    labelOrigin: new window.google.maps.Point(20,30),
                    anchor: new window.google.maps.Point(20,10),
                }}
                label={(this.state.showTitles)? this.getTitleLabel(this.props.title):''} 
                onMouseOver = {this.handleMouseOver}
                onMouseOut  = {this.handleMouseOut}
                onClick     = {this.handleClick}
            >
                {showPopup && this.props.details?  (
                    <InfoWindow>
                        <h5>{this.props.details}</h5>
                    </InfoWindow>
                ): <></>}
            </Marker>
            </>
        )
    }
}

export default Router;
