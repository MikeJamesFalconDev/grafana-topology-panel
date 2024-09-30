import { DataFrame } from "@grafana/data";
import { EdgeType, NodeType } from "types";


function getField(frame: DataFrame, name: string) {
    return frame.fields.find((field) => field.name === name)
}

export class TopologyClass {
    nodes: NodeType[];
    edges: EdgeType[];
    
    constructor(series: DataFrame[]) {
      this.nodes = this.getNodes(series);
      this.edges = this.getEdges(series);
      console.log('Edges ' + this.edges.length)
    }

    
    private getNodes(series: DataFrame[]): NodeType[] {
      const frame = series.find((frame) => frame.name === 'nodes' || getField(frame,'latitude') && getField(frame,'longitude'));
      if (!frame || frame.fields.length === 0) {
        console.log('Nodes frame not found')
        return [];
      }
      const idField     =   getField(frame, 'id'); 
      const titleField  =   getField(frame, 'title');
      const latField    =   getField(frame, 'latitude'); 
      const lngField    =   getField(frame, 'longitude')
      const detailsField     = getField(frame, 'details');
      if (!idField || !titleField || !latField || !lngField) {
        console.log('Missing fields: id: ' + idField + ' title: ' + titleField + ' latitude: ' + latField + ' longitude: ' + lngField)
        return [];
      }
      const locations = new Map<string, NodeType>()
      let lat, lng, latlng
      let coordinates: google.maps.LatLng
      let node: NodeType
      return frame.fields[0].values.reduce (
        (acc, value,index) => {
          lat = (latField.values[index])? latField.values[index]: -36
          lng = (lngField.values[index])? lngField.values[index]: -64
          latlng = lat + '_' + lng
          coordinates = new google.maps.LatLng( {
              lat: lat,
              lng: lng
            }
          )
          node =  {
            name: idField.values[index],
            title: titleField.values[index],
            details: (detailsField)? detailsField.values[index] : '',
            coordinates: coordinates,
            more: []
          }
          node.more.push(node)
          if (locations.has(latlng)) {
            let existing = locations.get(latlng)
            if (existing) {
              existing.more.push(node)
            }
          } else {
            console.log('Adding node')
            acc.push(node)
            locations.set(latlng, node)
          }
          return acc;
        } , []
      );
    }
  
    private findNode(name: String): NodeType | undefined {
      let node = this.nodes.find((curr)=> curr.name === name);
      if (!node) {
        this.nodes.forEach((current) => node = current.more.find((curr)=> curr.name === name))
      }
      return node
    }
  
    private getEdges(series: DataFrame[]): EdgeType[] {
  
      const frame = series.find((frame) => getField(frame, 'source') && getField(frame, 'target'));
      if (!frame || frame.fields.length === 0) {
        console.log('Edges frame not found')
        return [];
      }
  
      const sourceField     = getField(frame, 'source');
      const targetField     = getField(frame, 'target');
      const sourceLoadField = getField(frame, 'sourceLoad');
      const targetLoadField = getField(frame, 'targetLoad');
      if (!sourceField || !targetField) {
        console.log('Edge source or target field missing: source '+ sourceField + ' target '+ targetField);
        return [];
      }
      return frame.fields[0].values.reduce (
        (acc, value, index) => {
          const source = this.findNode(sourceField.values[index]);
          const target = this.findNode(targetField.values[index]);
          if (source && target) {
            acc.push(
              {
                name: source.title + '-' + target.title,
                source: source,
                target: target,
                endpoints: [source.name,target.name],
                coordinates: [source.coordinates, target.coordinates],
                load: [ (sourceLoadField)? sourceLoadField.values[index]: -1, (targetLoadField)? targetLoadField.values[index]: -1 ]
              }
            )
          } else {
            console.log('Source or Target not found: index: ' + index + '\tvalue: ' + value + '\n\tsource: '+ source + '\n\ttarget: '+target);
            console.log(sourceField.values[index])
          }
          return acc;
        }, []
      );
    }
  
}
