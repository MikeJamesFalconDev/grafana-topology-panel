import React, { Component } from 'react'
import { InfoWindow, Marker } from '@react-google-maps/api';
import { NodeType, Offset, RouterProps } from 'types';
import site_icon from 'img/building.svg'
import Router from './Router';

class Site extends Component<RouterProps> {
    state = {
        showPopup: false,
        highlight: false,
        showTitles: false,
        exploded: false
    }

    handleMouseOver = (e: google.maps.MapMouseEvent) => {
        this.setState({
            ...this.state,
            showPopup: true,
            highlight: true,
            showTitles: true
        })
    };

    handleMouseOut = (e: google.maps.MapMouseEvent) => {
        this.setState({
            ...this.state,
            showPopup: false,
            highlight: false,
            showTitles: false
        })
    };
    handleClick = (e: google.maps.MapMouseEvent) => {
        this.setState({
            ...this.state,
            exploded: !this.state.exploded
        })
    }

    getTitleLabel(node: NodeType): google.maps.MarkerLabel {
        let title = ''
        node.more.forEach((child) => title += child.title + ' ')
        return {
          text: title,
          fontSize: '10'
        }
      }
    
      getChildCoords(index: number, count: number): Offset {
        const r = 100
        const alfa = 2 * Math.PI / count
        console.log('Displacement: Lat:' + (r * Math.sin(alfa * index)) + ' Lng; ' + (r * Math.cos(alfa * index)))
        return {
            x: r * Math.sin(alfa * index),
            y: r * Math.cos(alfa * index)
          }
      }

//     animation={(highlight)?google.maps.Animation.DROP:undefined}


      render(): React.ReactNode {
        console.log('Displaying site')
        const { showPopup } = this.state;
        const { node, options} = this.props;
        let explodedNodes: NodeType[] = (this.state.exploded)? node.more: []
        return (
            <>
            <Marker 
                position={node.coordinates} 
                icon={{
                    url:site_icon, 
                    scaledSize: new window.google.maps.Size(80, 80), 
                    labelOrigin: new window.google.maps.Point(40,90),
                    anchor: new window.google.maps.Point(20,50),
                }}
                label={(this.state.showTitles && ! this.state.exploded)? this.getTitleLabel(node):''} 
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

            {
                explodedNodes.map((child, index, children) => 
                <>
                    <Router key={child.name} node={child} offset={this.getChildCoords(index, children.length)} options={options} />
                </>
                )
            }
            </>
        )
    }
}

export default Site;
