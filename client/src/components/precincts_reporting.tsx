import * as React from 'react';

interface Properties {
    precincts_reported?: number;
    total_precincts?: number;
}

export function PrecinctsReporting({precincts_reported = 0, total_precincts = 0}: Properties) {
    return (
        <div>{precincts_reported} out of {total_precincts} precincts reporting.</div>
    );
}