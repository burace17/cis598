import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { renderable, tsx } from "esri/widgets/support/widget";
import { Result } from "types/index";
import { VoteTotal } from "./vote_total";
import * as React from 'react';

@subclass("esri.widgets.ResultInfo")
class ResultInfo extends declared(Widget) {
    @property()
    results: Result;

    render()
    {
        return <VoteTotal info={this.results.candidates} totalVotes={this.results.totalVotes} />
    }
}