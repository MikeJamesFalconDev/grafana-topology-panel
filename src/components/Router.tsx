import React, { Component } from 'react'
import { Marker , InfoWindow} from '@react-google-maps/api';
import { NodeType, TopologyOptions } from 'types';

const router_icon = 'https://symbols.getvecta.com/stencil_240/204_router.7b208c1133.svg'

interface RouterProps {
    node: NodeType,
    options: TopologyOptions
}

class Router extends Component<RouterProps> {
    state = {
        showPopup: false,
        highlight: false        
    }

    handleMouseOver = (e) => {
        this.setState({
            showPopup: true,
            highlight: true        
        })
    };

    handleMouseOut = (e) => {
        this.setState({
            showPopup: false,
            highlight: false
        })
    };
    handleClick = (e) => {
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
    
    render(): React.ReactNode {
        const { showPopup, highlight } = this.state;
        const { node, options } = this.props;
        return (
            <Marker label={(options.showNodeTitles)? this.getTitleLabel(node.title):''} 
                position={node.coordinates} 
                icon={{
                    url:router_icon, 
                    scaledSize: new window.google.maps.Size(40, 20), 
                    labelOrigin: new window.google.maps.Point(20,30),
                    anchor: new window.google.maps.Point(20,10),
                }}
                animation={(highlight)?google.maps.Animation.DROP:undefined}
                onMouseOver = {this.handleMouseOver}
                onMouseOut  = {this.handleMouseOut}
                onClick     = {this.handleClick}
            >
                {showPopup && (
                    <InfoWindow>
                        <h5>{node.details}</h5>
                    </InfoWindow>
                )}
            </Marker>        
        )
    }
}

export default Router;
