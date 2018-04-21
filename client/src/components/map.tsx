import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Map, esriPromise } from 'react-arcgis';
import { CandidateInfo, Candidate } from '../types/index';

interface Properties {
    voteData: CandidateInfo;
}

export class ResultMap extends React.Component<Properties, object> {
    map: __esri.Map = null;
    view: __esri.MapView = null;
    shape: __esri.FeatureLayer = null;

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
            this.shape = new FeatureLayer({
                url: "https://services8.arcgis.com/yBvhbG6FeRtNxtFh/arcgis/rest/services/PA18/FeatureServer",
                outFields: ["NAME"]
            });
    
            this.shape.queryFeatures().then(featureSet => {
                for (var i = 0; i < featureSet.features.length; i++)
                {
                    var graphic = featureSet.features[i];
                    const symbol = new SimpleFillSymbol({
                        type: "simple-fill",
                        color: [255, 0, 0, ],
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
                    newGraphic.setAttribute("test", "test1234");
                    view.graphics.add(newGraphic);
                }
            });

            this.shape.queryExtent().then(response => {
               this.view.goTo(response.extent);
            });

            this.view.on("pointer-move", event => {
                this.view.hitTest(event).then(response => {
                    const graphic = response.results[0].graphic;
                    console.log(graphic.attributes);
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
            <Map onLoad={this.handleMapLoad} onFail={this.handleMapError} />
        );
    }
}