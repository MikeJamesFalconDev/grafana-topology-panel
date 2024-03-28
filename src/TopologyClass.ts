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
        console.log('Missing fields: id: ' + idField + ' titleField: ' + titleField + ' latitude: ' + latField + ' longitude: ' + lngField)
        return [];
      }
      return frame.fields[0].values.reduce (
        (acc, value,index) => {
          acc.push( {
            name: idField.values[index],
            title: titleField.values[index],
            details: (detailsField)? detailsField.values[index] : '',
            coordinates: {
              lat: (latField.values[index])? latField.values[index]: -36,
              lng: (lngField.values[index])? lngField.values[index]: -64
            }
          });
          return acc;
        } , []
      );
    }
  
    private findNode(name: String): NodeType | undefined {
      return this.nodes.find((curr)=> curr.name === name);
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
                name: source.name+ '-' + target.name,
                endpoints: [source.name,target.name],
                coordinates: [source.coordinates, target.coordinates],
                load: [ (sourceLoadField)? sourceLoadField.values[index]: '', (targetLoadField)? targetLoadField.values[index]: '' ]
              }
            )
          } else {
            console.log('Source or Target not found: '+ value + '\n\tsource: '+ source + '\n\ttarget: '+target);
          }
          return acc;
        }, []
      );
    }
  
}
