export interface Candidate {
    display_name: string;
    party: string;
}

export type CandidateInfo = Map<string, Candidate>;