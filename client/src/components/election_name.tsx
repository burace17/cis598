import * as React from "react";
import { Result } from "../types/index";

interface Properties {
    result: Result;
}

export function ElectionName(props: Properties) {
    const name = props.result? props.result.name : "Election Results";
    return (<h1 className="mt-5">{name} Results</h1>);
}