import React, { Component } from 'react'
import { Polyline, InfoWindow } from '@react-google-maps/api';
import { EdgeType, TopologyOptions } from 'types';

interface LinkProps {
    link: EdgeType
    options: TopologyOptions
}

class Link extends Component<LinkProps> {

    getColor(position: string): string {
        const value = this.props.link.load[(position ==='start')?0:1]
        const colorRanges = this.props.options.linkLight;
        return colorRanges.find((range) => value >= range.threshold)?.color || this.props.options.linkLightDefault;
    }

//function getStroke(props:LinkProps, color: string, position:'start'|'end'): google.maps.IconSequence {
//    const start = ((position === 'start')?-10: 0).toString(); 
//    const end = ((position === 'start')? 0: 10).toString(); 
//    const offset = ((position === 'start')? 0: 1).toString();
//    return (
//    { icon:
//        {
//            path: 'm 0,'+start+' L 0,'+end,
//            strokeOpacity: 1,
//            scale: 4,
//            strokeColor: color
//        },
//        offset: offset
//    });
//  }

    getLight(props: LinkProps, position: 'start'|'end'): google.maps.IconSequence {
        const offset = ((position === 'start')? 0: 1).toString();
        const cx = 0;
        const cy =(position === 'start')?-4: 4;
        const r = 1;
        const d = r*2;
        return (
            { icon:
                {
                    path: 'M '+(cx - r)+', '+cy+' a '+r+','+r+' 0 1,0 '+d+',0 a '+r+','+r+' 0 1,0 -'+d+',0 Z',
                    scale: 4,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#000000',
                    fillOpacity: 1,
                    fillColor: this.getColor(position)
                },
                offset: offset
            });
        }

//function getLineLength(props:LinkProps, window: Window & typeof globalThis):number {
//    return Math.round(window.google.maps.geometry.spherical.computeLength(props.link.coordinates))
//}

    getIcons(): google.maps.IconSequence[]|null  {
        return (this.props.options.showLinkUsage)?[
    //        getStroke(props, '#32a836', 'start'),
    //        getStroke(props, '#db0404', 'end')
            this.getLight(this.props, 'start'),
            this.getLight(this.props, 'end')
        ]: [];
    }

    state = {
        showPopup: false,
        highlight: false        
    }

    handleMouseOver = (e) => {
        this.setState({
            showPopup: true,
            highlight: true
        })
    }

    handleMouseOut = (e) => {
        this.setState({
            showPopup: false,
            highlight: false
        })
    }

    handleClick = (e) => {}

    render(): React.ReactNode {
        const link = this.props.link
        const options = this.props.options
        return (options.showLinks)?(
            <Polyline path={link.coordinates} 
                    options={{
                        strokeColor:    (this.state.highlight)?'white':'dark grey', 
                        strokeWeight:   options.linkWeight, 
                        geodesic:       options.linkGeodesic, 
                        strokeOpacity:  options.linkOpacity,
                        icons:          this.getIcons()
                    }}
                    onMouseOver = {this.handleMouseOver}
                    onMouseOut  = {this.handleMouseOut}
                    onClick     = {this.handleClick}
            />
        ) :
            <></>
    }
}

export default Link
