export interface Candidate {
    display_name: string;
    party: string;
    votes: number;
}

export type CandidateInfo = Map<string, Candidate>;

export class Result {
    name: string;
    candidates: Map<string, Candidate>;
    partsReporting: number;
    totalParts: number;

    constructor(name: string, candidates: Map<string, Candidate>, partsReporting: number, totalParts: number)
    {
        this.name = name;
        this.candidates = candidates;
        this.partsReporting = partsReporting;
        this.totalParts = totalParts;
    }
}