import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Map, esriPromise } from 'react-arcgis';
import { CandidateInfo, Candidate, Result } from '../types/index';
import { ResultWidget } from './result_widget';

interface Properties {
    voteData: Map<string, Result>;
}

function getWinnerColor(result: Result)
{
    
}

export class ResultMap extends React.Component<Properties, object> {
    map: __esri.Map = null;
    view: __esri.MapView = null;
    widget: JSX.Element = null;

    cursorOverSubdiv: string = "";

    constructor(props: Properties)
    {
        super(props);
        this.props = props;
        this.handleMapLoad = this.handleMapLoad.bind(this);
    }

    handleMapLoad(map: __esri.Map, view: __esri.MapView)
    {
        this.map = map;
        this.view = view;
        esriPromise(["esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/Graphic", "esri/symbols/SimpleFillSymbol"]).then(([FeatureLayer, GraphicsLayer, Graphic, SimpleFillSymbol]) => {
            var shape: __esri.FeatureLayer = new FeatureLayer({
                url: "https://services8.arcgis.com/yBvhbG6FeRtNxtFh/arcgis/rest/services/PA18/FeatureServer",
                outFields: ["NAME"]
            });
    
            shape.queryFeatures().then(featureSet => {
                for (var i = 0; i < featureSet.features.length; i++)
                {
                    var graphic = featureSet.features[i];
                    const subdivName = graphic.getAttribute("NAME");
                    const subdivResults = this.props.voteData.get(subdivName.toUpperCase());

                    const symbol = new SimpleFillSymbol({
                        type: "simple-fill",
                        color: [255, 0, 0, 1.0],
                        style: "solid",
                        outline: {
                            color: "black",
                            width: 1
                        }
                    });
                    const newGraphic = new Graphic({
                        geometry: graphic.geometry.clone(),
                        symbol: symbol,
                        attributes: graphic.attributes
                    });
                    
                    
                    
                    subdivResults.candidates.forEach((info, name) => {
                        newGraphic.setAttribute(info.displayName, info.votes);
                    });
                    view.graphics.add(newGraphic);
                }
            });

            shape.queryExtent().then(response => {
               this.view.goTo(response.extent);
            });

            this.view.on("pointer-move", event => {
                this.view.hitTest(event).then(response => {
                    const graphic = response.results[0].graphic;
                    const subdivName = graphic.getAttribute("NAME");
                    const subdivResults = this.props.voteData.get(subdivName.toUpperCase());
                    
                    if (subdivResults.name !== this.cursorOverSubdiv)
                    {
                        this.cursorOverSubdiv = subdivResults.name;
                        this.widget = <ResultWidget result={subdivResults} view={this.view} />
                        console.log("update widget");
                        this.forceUpdate();
                    }
                        
                });
            });
        });
    }

    handleMapError(e: Error)
    {
        console.error(e);
    }

    render() 
    { 
        return ( 
            <Map onLoad={this.handleMapLoad} onFail={this.handleMapError}>{this.widget}</Map>
        );
    }
}