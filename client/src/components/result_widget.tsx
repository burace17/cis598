import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { esriPromise } from "react-arcgis";
import { Result } from "../types/index";
import { VoteTotal } from "./vote_total";

interface Properties 
{
    result: Result;
    view: __esri.MapView;
}

export class ResultWidget extends React.Component<Properties, object> 
{
    widget: HTMLElement;
    constructor(props: Properties)
    {
        super(props);
        this.props = props;
        this.widget = null;
    }

    render() : JSX.Element
    {
        console.log("render widget");
        return <VoteTotal result={this.props.result} />;
    }

    componentWillMount()
    {
        //console.log("render widget");
        //const resultInfo = 
    }

    componentWillUnmount()
    {
        this.props.view.ui.remove(this.widget);
    }
}