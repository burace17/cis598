import * as React from 'react';
import { CandidateInfo, Candidate } from '../types/index';

interface Properties {
    info: CandidateInfo;
    totalVotes: number;
}

export function VoteTotal(props: Properties) {
    const info: CandidateInfo = props.info;
    const totalVotes = props.totalVotes;
    var candidateElements: Array<JSX.Element> = [];
    if (info)
    {
        info.forEach(elem => {
            candidateElements.push((
                <tr>
                <td>{elem.displayName}</td>
                <td>{elem.party}</td>
                <td>{elem.votes}</td>
                <td>{((elem.votes / totalVotes) * 100).toFixed(2)}</td>
                </tr>
            ));
        });
    }
    
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