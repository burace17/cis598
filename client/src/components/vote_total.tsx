import * as React from 'react';
import { CandidateInfo, Candidate, Result } from '../types/index';

interface Properties 
{
    result: Result;
}

export function VoteTotal(props: Properties) {
    var candidateElements: Array<JSX.Element> = [];
    if (props.result)
    {
        // Convert the Map to an Array so we can sort it by number of votes.
        const sorted = props.result.getSortedCandidates();
        sorted.forEach(elem => {
            candidateElements.push((
                <tr>
                <td>{elem[1].displayName}</td>
                <td>{elem[1].party}</td>
                <td>{elem[1].votes.toLocaleString()}</td>
                <td>{props.result.totalVotes === 0 ? 0.0 : ((elem[1].votes / props.result.totalVotes) * 100).toFixed(2)}</td>
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