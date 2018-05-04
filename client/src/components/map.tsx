import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Map, esriPromise } from 'react-arcgis';
import { CandidateInfo, Candidate, Result } from '../types/index';
import { Config } from "../config";

interface Properties 
{
    voteData: Map<string, Result>;
    actual: boolean;
    mouseOver: (actual: boolean, result: Result) => void;
    mouseLeave: (actual: boolean) => void;
}

// Eventually, this will become a configurable option.
function getWinnerColor(result: Result)
{
    if (result)
    {
        const winner = result.getWinner();
        if (winner[0] === "Tie")
        {
           return [220, 0, 255, 1.0];
        }
        else if (winner[0] === "NA")
        {
            return [145,145,145,1.0];
        }
        else if (winner[1].party === "Democratic")
        {
            return [34,0,255,1.0];
        }
        else 
        {
            return [255,0,0,1.0];
        }
    }
    return [0,0,0,1.0];
}

export class ResultMap extends React.Component<Properties, object> 
{
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
        esriPromise(["esri/layers/FeatureLayer", "esri/Graphic", "esri/symbols/SimpleFillSymbol"]).then(([FeatureLayer, Graphic, SimpleFillSymbol]) => 
        {
            var shape: __esri.FeatureLayer = new FeatureLayer(
            {
                url: Config.MAP_SERVICE_URL,
                outFields: ["NAME"]
            });
    
            shape.queryFeatures().then(featureSet => 
            {
                for (var i = 0; i < featureSet.features.length; i++)
                {
                    var graphic = featureSet.features[i];
                    const subdivName = graphic.getAttribute("NAME");
                    const subdivResults = this.props.voteData.get(subdivName.toLowerCase());

                    const symbol = new SimpleFillSymbol(
                    {
                        type: "simple-fill",
                        color: getWinnerColor(subdivResults),
                        style: "solid",
                        outline: 
                        {
                            color: "black",
                            width: 1
                        }
                    });
                    const newGraphic = new Graphic(
                    {
                        geometry: graphic.geometry.clone(),
                        symbol: symbol,
                        attributes: graphic.attributes
                    });

                    subdivResults.candidates.forEach((info, name) => 
                    {
                        newGraphic.setAttribute(info.displayName, info.votes);
                    });
                    view.graphics.add(newGraphic);
                }
            });

            shape.queryExtent().then(response => 
            {
               this.view.goTo(response.extent);
            });

            this.view.on("pointer-move", event => 
            {
                this.view.hitTest(event).then(response => 
                {
                    const graphic = response.results[0].graphic;
                    const subdivName = graphic.getAttribute("NAME");
                    const subdivResults = this.props.voteData.get(subdivName.toLowerCase());
                    if (subdivResults.name.toLowerCase() !== this.cursorOverSubdiv)
                    {
                        this.cursorOverSubdiv = subdivResults.name.toLowerCase();
                        this.props.mouseOver(this.props.actual, subdivResults);
                    }
                        
                });
            });

            this.view.on("pointer-leave", event => 
            {
                this.cursorOverSubdiv = "";
                this.props.mouseLeave(this.props.actual);
            });
        });
    }

    handleMapError(e: Error)
    {
        console.error(e);
    }

    componentDidUpdate()
    {
        class ChangedGraphic
        {
            graphic: __esri.Graphic;
            result: Result;
        }
        var changedGraphics: ChangedGraphic[] = [];
        this.view.graphics.forEach(graphic => 
        {
            const attributes = graphic.attributes;
            const name = graphic.getAttribute("NAME").toLowerCase();
            const newResults = this.props.voteData.get(name);
            for (const candidatePair of newResults.candidates)
            {
                const candidate = candidatePair[0];
                if (candidatePair[1].votes !== graphic.getAttribute(candidate))
                {
                    changedGraphics.push({graphic: graphic, result: newResults});
                    break;
                }
            }
        });
        esriPromise(["esri/symbols/SimpleFillSymbol", "esri/Graphic"]).then(([SimpleFillSymbol, Graphic]) => 
        {
            changedGraphics.forEach(changedGraphic => 
            {
                this.view.graphics.remove(changedGraphic.graphic);

                const symbol = new SimpleFillSymbol(
                {
                    type: "simple-fill",
                    color: getWinnerColor(changedGraphic.result),
                    style: "solid",
                    outline: 
                    {
                        color: "black",
                        width: 1
                    }
                });

                var newGraphic = new Graphic(
                {
                    geometry: changedGraphic.graphic.geometry.clone(),
                    symbol: symbol
                });

                newGraphic.setAttribute("NAME", changedGraphic.graphic.getAttribute("NAME"));
                
                changedGraphic.result.candidates.forEach((candidate, name) => 
                {
                    newGraphic.setAttribute(name, candidate.votes);
                });
    
                this.view.graphics.add(newGraphic);
            });
        });
        
    }

    render() 
    { 
        return ( 
            <Map onLoad={this.handleMapLoad} onFail={this.handleMapError}>{this.widget}</Map>
        );
    }
}