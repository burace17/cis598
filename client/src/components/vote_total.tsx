import * as React from 'react';
import { CandidateInfo, Candidate } from '../types/index';

export interface Properties {
    info: CandidateInfo;
}

export function VoteTotal(props: Properties) {
    const info: CandidateInfo = props.info;
    var candidateElements: Array<JSX.Element> = [];
    info.forEach(elem => {
        candidateElements.push((
            <tr>
            <td>{elem.display_name}</td>
            <td>{elem.party}</td>
            <td>{0}</td>
            <td>{0.0}</td>
            </tr>
        ));
    });
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Votes</th>
                <th>Percentage</th>
            </tr>
            </thead>
            
            <tbody>  
               {candidateElements}
            </tbody>
            
        </table>
    );
}