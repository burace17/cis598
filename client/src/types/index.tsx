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
}