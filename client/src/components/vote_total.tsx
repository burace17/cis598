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
        // Convert the Map to an Array so we can sort it by number of votes.
        const mapArr = Array.from(info);
        const sorted = mapArr.sort((a, b) => {
            if (a[1].votes < b[1].votes)
                return -1;
            else if (a[1].votes === b[1].votes)
                return 0;
            else
                return 1;
        }).reverse();
        sorted.forEach(elem => {
            candidateElements.push((
                <tr>
                <td>{elem[1].displayName}</td>
                <td>{elem[1].party}</td>
                <td>{elem[1].votes.toLocaleString()}</td>
                <td>{((elem[1].votes / totalVotes) * 100).toFixed(2)}</td>
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