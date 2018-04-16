import * as React from 'react';

export class VoteTotal extends React.Component {
    render() {
        return (
        <table className="table">
            <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Votes</th>
                <th>Percentage</th>
            </tr>
        </table>
        );
    }
}