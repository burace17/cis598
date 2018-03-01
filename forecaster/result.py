class Result:
    """
    Stores the result of an election. This class is essentially a light wrapper around a dictionary
    with added protection against malformed data.  
    """

    def __init__(self, candidates, name):
        """
        Construct a new result instance
            :param candidates: A list of strings containing the candidates in this election
            :param name: The location these results are from (county name, precinct ID, etc.)
        """
        assert isinstance(candidates, list)
        self.candidates = {}
        self.total_votes = 0
        self.name = name
        for candidate in candidates:
            self.candidates[candidate] = 0
            
    
    def add_votes(self, candidate, votes):
        """
        Add the specified number of votes to the specified candidate. Raises ValueError if
        the candidate is not stored in this object 
        """
        if not candidate in self.candidates.keys():
            raise ValueError
        else:
            self.candidates[candidate] += votes
            self.total_votes += votes

    def __add__(self, other):
        """
        Overrides the addition operator to allow the votes stored in two Result objects to be added together
        """
        assert isinstance(other, Result)
        for candidate in other.candidates.keys():
            assert candidate in self.candidates
            self.add_votes(candidate, other.get_votes(candidate))
        return self

    def get_votes(self, candidate):
        """
        Get the number of votes this candidate has received. Raises ValueError if the candidate
        is not stored in this object.
        """
        if not candidate in self.candidates.keys():
            raise ValueError
        else:
            return self.candidates[candidate]

    def __safeCalculateVotePercentage(self, candidate_votes, total):
        """
        Used to safely calculate the percentage of the total votes a candidate receives by avoiding
        division by zero
        """
        assert total != 0 or candidate_votes == 0
        if total == 0:
            return 0.0
        else:
            return candidate_votes / total

    def get_percentage(self, candidate):
        """
        Gets the percentage of the total votes the specified candidate has received. Raises ValueError if the
        candidate is not stored in this object.
        """
        if not candidate in self.candidates.keys():
            raise ValueError
        else:
            return self.__safeCalculateVotePercentage(self.candidates[candidate], self.total_votes)

    def get_total_votes(self):
        """
        Returns the total number of votes stored in this object
        """
        return self.total_votes

    def get_summary(self):
        """
        Returns a dictionary that maps candidate names to vote counts for all candidates tracked by this object
        """
        return self.candidates

    def get_percentage_summary(self):
        """
        Returns a dictionary that maps candidate names to the percentage of the total vote they have received
        """
        summary = {}
        for candidate in self.candidates:
            summary[candidate] = self.__safeCalculateVotePercentage(self.candidates[candidate], self.total_votes)
        return summary

    def get_name(self):
        """
        Returns the location name for this data
        """
        return self.name
        
