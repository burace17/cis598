import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WebMap } from 'react-arcgis';
import { CandidateInfo, Candidate } from '../types/index';

interface Properties {
    voteData: CandidateInfo;
}

export function ResultMap(props: Properties) {
    return (
        <WebMap id="6e49c74daa1242a4a94e75a3a4668a52" />
    );
}