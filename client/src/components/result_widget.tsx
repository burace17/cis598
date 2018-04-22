import * as React from "react";
import { esriPromise } from "react-arcgis";
import { Result } from "../types/index";

interface Properties 
{
    result: Result;
    view: __esri.MapView;
}

export class ResultWidget extends React.Component<Properties, object> 
{
    widget: __esri.Widget;
    constructor(props: Properties)
    {
        super(props);
        this.props = props;
        this.widget = null;
    }

    render() : JSX.Element
    {
        return null;
    }

    componentWillMount()
    {
        esriPromise(["./result_widget_impl"]).then(([ResultInfo]) => 
        {
            console.log("widget loaded");
            var resultInfo = new ResultInfo();
            resultInfo.results = this.props.result;
            this.widget = resultInfo;
            this.props.view.ui.add(resultInfo, { position: "bottom-right", index: 2});
        });
    }

    componentWillUnmount()
    {
        this.props.view.ui.remove(this.widget);
    }
}