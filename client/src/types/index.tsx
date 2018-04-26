export interface Candidate {
    displayName: string;
    party: string;
    votes: number;
}

export type CandidateInfo = Map<string, Candidate>;

export class Result {
    name: string;
    candidates: CandidateInfo;
    partsReporting: number;
    totalParts: number;
    totalVotes: number;

    constructor(name: string, candidates: CandidateInfo, partsReporting: number, totalParts: number, totalVotes: number)
    {
        this.name = name;
        this.candidates = candidates;
        this.partsReporting = partsReporting;
        this.totalParts = totalParts;
        this.totalVotes = totalVotes;
    }

    getSortedCandidates()
    {
        const mapArr = Array.from(this.candidates);
        const sorted = mapArr.sort((a, b) => {
            if (a[1].votes < b[1].votes)
                return -1;
            else if (a[1].votes === b[1].votes)
                return 0;
            else
                return 1;
        }).reverse();

        return sorted;
    }
    getWinner() : [string, Candidate]
    {
        const sorted = this.getSortedCandidates();
        const winner = sorted[0];

        if (winner[1].votes === 0)
            return ["NA", null];
        
            if (winner[1].votes === sorted[1][1].votes)
            return ["Tie", null];

        return winner;
    }
}