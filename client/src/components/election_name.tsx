import * as React from 'react';

interface Properties {
    name: string;
}

export function ElectionName(props: Properties) {
    if (props.name === undefined) {
        props.name = "Election Results";
    }
    return (<h1 className="mt-5">{props.name} Results</h1>);
}