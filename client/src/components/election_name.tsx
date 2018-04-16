import * as React from 'react';

interface Properties {
    name: string;
}

export function ElectionName(props: Properties) {
    return (<h1 className="mt-5">{props.name} Results</h1>);
}