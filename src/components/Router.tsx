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
        showTitles: false,
    }

    handleMouseOver = (e: Event | MouseEvent | TouchEvent | PointerEvent | KeyboardEvent) => {
        this.setState({
            showPopup: true,
            highlight: true,
            showTitles: true
        })
    };

    handleMouseOut = (e: Event | MouseEvent | TouchEvent | PointerEvent | KeyboardEvent) => {
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

//     animation={(highlight)?google.maps.Animation.DROP:undefined}


      render(): React.ReactNode {
        console.log('Router render ' + this.props.name)
        const { showPopup } = this.state;

        // return (
        //     <>
        //     <Marker 
        //         position={this.getCoordinates()} 
        //         icon={{
        //             url:router_icon, 
        //             scaledSize: new window.google.maps.Size(40, 20), 
        //             labelOrigin: new window.google.maps.Point(20,30),
        //             anchor: new window.google.maps.Point(20,10),
        //         }}
        //         label={(this.state.showTitles)? this.getTitleLabel(this.props.title):''} 
        //         onMouseOver = {this.handleMouseOver}
        //         onMouseOut  = {this.handleMouseOut}
        //         onClick     = {this.handleClick}
        //     >
        //         {showPopup && this.props.details?  (
        //             <InfoWindow>
        //                 <h5>{this.props.details}</h5>
        //             </InfoWindow>
        //         ): <></>}
        //     </Marker>
        //     </>
        // )
        return (
            <AdvancedMarker 
                position={this.props.coordinates}
                onMouseEnter={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}
                onClick={this.handleClick}
            >
                <img src={router_icon} width={32} height={32} style={{position: 'relative', top: 15, left: 0}} />
                {showPopup ?  (
                    <InfoWindow>
                        <h5>{this.props.title}</h5>
                    </InfoWindow>
                ): <></>}
            </AdvancedMarker>
        )
    }
}

export default Router;
