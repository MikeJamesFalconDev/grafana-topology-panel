import React, { Component } from 'react'
import { InfoWindow, Polyline } from '@react-google-maps/api';
import { EdgeType, TopologyOptions } from 'types';
import 'css/Link.css'

interface LinkProps {
    link: EdgeType
    options: TopologyOptions
}

class Link extends Component<LinkProps> {

    compute = google.maps.geometry.spherical

    getColor(position: string): string {
        const value = this.props.link.load[(position ==='start')?0:1]
        const colorRanges = this.props.options.linkLight;
        return colorRanges.find((range) => value >= range.threshold)?.color || this.props.options.linkLightDefault;
    }

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


    getIcons(): google.maps.IconSequence[]|null  {
        return (this.props.options.showLinkUsage)?[
            this.getLight(this.props, 'start'),
            this.getLight(this.props, 'end')
        ]: [];
    }

    state = {
        showPopup: false,
        highlight: false        
    }

    handleMouseOver = (e: google.maps.MapMouseEvent) => {
        this.setState({
            showPopup: true,
            highlight: true
        })
    }

    handleMouseOut = (e: google.maps.MapMouseEvent) => {
        this.setState({
            showPopup: false,
            highlight: false
        })
    }

    handleClick = (e: google.maps.MapMouseEvent) => {}

    calculatePoputLoc() {
        const distance = this.compute.computeDistanceBetween(this.props.link.coordinates[0], this.props.link.coordinates[1])
        const offset = distance * 0.5
        const heading = this.compute.computeHeading(this.props.link.coordinates[0], this.props.link.coordinates[1])
        return this.compute.computeOffset(this.props.link.coordinates[0], offset, heading)
    }

    render(): React.ReactNode {
        const link = this.props.link
        const options = this.props.options
        console.log('Link load: ' + JSON.stringify(this.props.link.load))
        return <div>
            { this.state.showPopup && this.props.link.load[0] > 0? 
            <InfoWindow position={this.calculatePoputLoc()}>
                <div>
                    <h5>{this.props.link.name}</h5>
                    <h6>{this.props.link.source.title} load {this.props.link.load[0]}</h6>
                    <h6>{this.props.link.target.title} load {this.props.link.load[1]}</h6>
                </div>
            </InfoWindow> : <></>}
            <Polyline path={link.coordinates}
                    visible={options.showLinks}
                    options={{
                        strokeColor:    (this.state.highlight)?'grey':'dark grey', 
                        strokeWeight:   options.linkWeight, 
                        geodesic:       options.linkGeodesic, 
                        strokeOpacity:  options.linkOpacity,
                        icons:          this.getIcons()
                    }}
                    onMouseOver = {this.handleMouseOver}
                    onMouseOut  = {this.handleMouseOut}
                    onClick     = {this.handleClick}
            />
        </div>
    }
}

export default Link
