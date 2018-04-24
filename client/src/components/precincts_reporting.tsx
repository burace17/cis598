import * as React from 'react';
import { Result } from "../types/index";
interface Properties {
    result: Result;
}

export function PrecinctsReporting(props: Properties) {
    const precinctsReporting = props.result? props.result.partsReporting : 0;
    const totalPrecincts = props.result? props.result.totalParts : 0;
    return (
        <div>{precinctsReporting} out of {totalPrecincts} precincts reporting.</div>
    );
}