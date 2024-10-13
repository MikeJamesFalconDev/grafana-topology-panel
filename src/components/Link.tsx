import React, { Component } from 'react'
import { LinkProps } from 'types';
import 'css/Link.css'
import { Polyline } from './poliyline';
import { InfoWindow } from '@vis.gl/react-google-maps';


class Link extends Component<LinkProps> {

    compute = google.maps.geometry?.spherical

    getColor(position: string): string {
        const value = this.props.load[(position ==='start')?0:1]
        const colorRanges = this.props.options.linkLight;
        return colorRanges.find((range) => value >= range.threshold)?.color || this.props.options.linkLightDefault;
    }

    getLight(props: LinkProps, position: 'start'|'end'): google.maps.IconSequence {
        const offset = ((position === 'start')? 0: 1).toString();
        const cx = 0;
        const cy =(position === 'start')?-10: 10;
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

    getTitle() {
        return this.props.source.title + '<->' + this.props.target.title
    }

    getCoordinates(): google.maps.LatLng[] {
        return [this.props.source.coordinates, this.props.target.coordinates]
    }

    calculatePoputLoc() {
        const srcCoords = this.props.source.coordinates
        const targetCoords = this.props.target.coordinates
        const distance = this.compute.computeDistanceBetween(srcCoords, targetCoords)
        const offset = distance * 0.5
        const heading = this.compute.computeHeading(srcCoords, targetCoords)
        return this.compute.computeOffset(srcCoords, offset, heading)
    }

    render(): React.ReactNode {
        console.log('Link render')
        const options = this.props.options
        // console.log("Path " + JSON.stringify(this.getCoordinates()))
        // console.log("weight: " + options.linkWeight + " geodesic " + options.linkGeodesic + " opacity " + options.linkOpacity)
        return <>
            { this.state.showPopup && (this.props.load[0] > 0)? 
            <InfoWindow headerContent={<h5>{this.getTitle()}</h5>} position={this.calculatePoputLoc()}>
                <div>
                    <h6>{this.props.source.title} load {this.props.load[0]}</h6>
                    <h6>{this.props.target.title} load {this.props.load[1]}</h6>
                </div>
            </InfoWindow> : <></>}
            <Polyline path={this.getCoordinates()}
                    visible={options.showLinks}
                    icons={this.getIcons()}
                    geodesic={options.linkGeodesic}
                    editable={false}
                    strokeColor={(this.state.highlight)?'grey':'dark grey'}
                    strokeWeight={options.linkWeight}
                    strokeOpacity={options.linkOpacity}
                    onMouseOver = {this.handleMouseOver}
                    onMouseOut  = {this.handleMouseOut}
                    onClick     = {this.handleClick}
            /> 
        </>
    }
}

export default Link
