import React, { Component } from 'react'
import { RouterProps } from 'types';
import {AdvancedMarker, InfoWindow} from '@vis.gl/react-google-maps';

const router_icon = 'https://symbols.getvecta.com/stencil_240/204_router.7b208c1133.svg'

class Router extends Component<RouterProps> {

    constructor(props: RouterProps) {
        super(props)
    }

    state = {
        showPopup: false,
        highlight: false,
    }

    handleMouseOver = (e: Event | MouseEvent | TouchEvent | PointerEvent | KeyboardEvent) => {
        this.setState({
            showPopup: true,
            highlight: true,
        })
    };

    handleMouseOut = (e: Event | MouseEvent | TouchEvent | PointerEvent | KeyboardEvent) => {
        this.setState({
            showPopup: false,
            highlight: false,
        })
    };

    handleClick = (e: google.maps.MapMouseEvent) => {
        if (!this.props.options.nodeClickUrl) {
            return
        }
        const url = this.props.options.nodeClickUrl.replace('{name}', this.props.name).replace('{title}', this.props.title);
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
        console.log('Router render ' + this.props.name)
        return (
            <AdvancedMarker 
                position={this.props.coordinates}
                onMouseEnter={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}
                onClick={this.handleClick}
            >
                <img src={router_icon} width={32} height={32} style={{position: 'relative', top: 15, left: 0}} />
                {this.state.showPopup?  (
                    <InfoWindow headerContent={<h5>{this.props.title}</h5>} position={this.props.coordinates} pixelOffset={[0,-20]}>
                        {this.props.details}
                    </InfoWindow>
                ): <></>}
            </AdvancedMarker>
        )
    }
}

export default Router;
