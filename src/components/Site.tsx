import React, { Component } from 'react'
import { InfoWindow, Marker } from '@react-google-maps/api';
import { Offset, SiteProps } from 'types';
import site_icon from 'img/building.svg'
import Router from './Router';

class Site extends Component<SiteProps> {

    state = {
        showPopup: false,
        highlight: false,
        showTitles: false,
        expanded: false,
        offset: {
            x: 0,
            y: 0
        },
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
        if (!this.state.expanded) {
            this.props.addRouters(this.props.routers)
        } else {
            this.props.removeRouters(this.props.routers)
        }
        this.setState({
            ...this.state,
            expanded: !this.state.expanded
        })
        
    }

    getTitleLabel(): google.maps.MarkerLabel {
        let title = ''
        this.props.routers.forEach((child) => title += child.props.title + ' ')
        return {
          text: title,
          fontSize: '10'
        }
      }
    
      getChildCoords(index: number, count: number): Offset {
        if (this.state.expanded === true) {
            console.log('Not expanded')
            return { x: 0, y: 0}
        }

        const r = 100
        const alfa = 2 * Math.PI / count
        console.log('x:' + r * Math.sin(alfa * index) + ' y:' + r * Math.cos(alfa * index))
        return {
            x: r * Math.sin(alfa * index),
            y: r * Math.cos(alfa * index)
          }
      }

      updateOffsets() {
        let count = this.props.routers.length
        for(let i=0; i < count; i++) {
            console.log('Updating coordinates for ' + this.props.routers[i].props.title)
            this.props.routers[i].setOffset(this.getChildCoords(i,count))
        }
      }

      public add(router: Router) {
        this.props.routers.push(router)
        this.updateOffsets()
      }


      render(): React.ReactNode {
        console.log('Site render: ' + this.props.routers.length)
        const { showPopup } = this.state;
        let anchor
        let icon
        if (this.state.expanded) {
            anchor = new window.google.maps.Point(this.state.r,this.state.r)
            const cw = this.state.r * 2
            const ch = cw
            const cr = this.state.r
            const svg = '<svg id="some_id" data-name="some_name" xmlns="http://www.w3.org/2000/svg" viewbox ="0 0 '+cw +' '+ch+'" width="'+cw+'" height="'+ch+'"><circle cx="'+cr+'" cy="'+cr+'" r="'+cr+'" fill-opacity="0.3" fill="blue"/></svg>'
            let icon_url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
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
                position={this.props.coordinates} 
                icon={icon}
                label={(this.state.showTitles && ! this.state.expanded)? this.getTitleLabel():''} 
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

            {/* { this.state.expanded && this.props.routers.map((router, index, routers) => <Router key={index} {...router.props} offset={this.getChildCoords(index, routers.length)} /> )} */}
            </>
        )
    }
}

export default Site;
