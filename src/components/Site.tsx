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
        exploded: false,
        r: 100
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
        let anchor
        let icon
        if (this.state.exploded) {
            anchor = new window.google.maps.Point(this.state.r,this.state.r)
            const cw = this.state.r * 2
            const ch = cw
            const cr = this.state.r
            const svg = '<svg id="some_id" data-name="some_name" xmlns="http://www.w3.org/2000/svg" viewbox ="0 0 '+cw +' '+ch+'" width="'+cw+'" height="'+ch+'"><circle cx="'+cr+'" cy="'+cr+'" r="'+cr+'" fill-opacity="0.3" fill="blue"/></svg>'
            let icon_url = (this.state.exploded)? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg) : site_icon
            icon = {
                url: icon_url,
                labelOrigin: new window.google.maps.Point(40,90),
                anchor: anchor,

            }
        } else {
            anchor = new window.google.maps.Point(20,50)
            icon = {
                url: site_icon,
                scaledSize: new window.google.maps.Size(80, 80),
                labelOrigin: new window.google.maps.Point(40,90),
                anchor: anchor,

            }
        }

        return (
            <>
            <Marker 
                position={node.coordinates} 
                icon={icon}
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
