import React, { Component } from 'react'
import { InfoWindow, Marker } from '@react-google-maps/api';
import { RouterProps } from 'types';

const router_icon = 'https://symbols.getvecta.com/stencil_240/204_router.7b208c1133.svg'

class Router extends Component<RouterProps> {
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
        const url = this.props.options.nodeClickUrl.replace('{name}', this.props.node.name).replace('{title}', this.props.node.title);
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
    

//     animation={(highlight)?google.maps.Animation.DROP:undefined}


      render(): React.ReactNode {
        console.log('Displaying router')
        const { showPopup } = this.state;
        const node = this.props.node;
        const offsetX = (this.props.offset)?this.props.offset.x: 0
        const offsetY = (this.props.offset)?this.props.offset.y: 0

        return (
            <>
            <Marker 
                position={node.coordinates} 
                icon={{
                    url:router_icon, 
                    scaledSize: new window.google.maps.Size(40, 20), 
                    labelOrigin: new window.google.maps.Point(20,30),
                    anchor: new window.google.maps.Point(20 + offsetX,10 + offsetY),
                }}
                label={(this.state.showTitles)? this.getTitleLabel(node.title):''} 
                onMouseOver = {this.handleMouseOver}
                onMouseOut  = {this.handleMouseOut}
                onClick     = {this.handleClick}
            >
                {showPopup && node.details?  (
                    <InfoWindow>
                        <h5>{node.details}</h5>
                    </InfoWindow>
                ): <></>}
            </Marker>
            </>
        )
    }
}

export default Router;
