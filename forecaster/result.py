import copy
class Result:
    """
    Stores the result of an election. This class is essentially a light wrapper around a dictionary
    with added protection against malformed data.  
    """

    def __init__(self, candidates, name, parts_reporting=0, total_parts=0):
        """
        Construct a new result instance
            :param candidates: A list of strings containing the candidates in this election
            :param name: The location these results are from (county name, precinct ID, etc.)
            :param parts_reporting: (Optional) The number of parts at this location that have reported. For counties, this tends to be precincts (defaults to 0)
            :param total_parts: (Optional) Total number of parts (defaults to 0)
        """
        assert isinstance(candidates, dict)
        self.candidates = copy.deepcopy(candidates)
        self.total_votes = 0
        self.name = name

        self.parts_reporting = parts_reporting
        self.total_parts = total_parts
            
    def toDict(self):
        """
        Converts this object into a dictionary.
        """
        return {"name":self.name, "parts_reporting":self.parts_reporting, "total_parts":self.total_parts, "candidates":self.candidates, "total_votes":self.total_votes}
    
    def add_votes(self, candidate, votes):
        """
        Add the specified number of votes to the specified candidate. Raises ValueError if
        the candidate is not stored in this object 
        """
        if not candidate in self.candidates.keys():
            raise ValueError
        else:
            self.candidates[candidate]["votes"] += votes
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

    def __eq__(self, other):
        return other != None and len(set(self.candidates.items() ^ other.candidates.items())) == 0

    def get_votes(self, candidate):
        """
        Get the number of votes this candidate has received. Raises ValueError if the candidate
        is not stored in this object.
        """
        if not candidate in self.candidates.keys():
            raise ValueError
        else:
            return self.candidates[candidate]["votes"]

    def set_votes(self, candidate, votes):
        """
        Sets the number of votes for the given candidate to the given value. 
        """
        self.candidates[candidate]["votes"] = votes
        new_total = 0
        for candidate in self.candidates.keys():
            new_total += self.candidates[candidate]["votes"]
        self.total_votes = new_total

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
            return self.__safeCalculateVotePercentage(self.candidates[candidate]["votes"], self.total_votes)

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
            summary[candidate] = self.__safeCalculateVotePercentage(self.candidates[candidate]["votes"], self.total_votes)
        return summary

    def get_name(self):
        """
        Returns the location name for this data
        """
        return self.name
        
    def clear_votes(self):
        """
        Sets the number of votes for all candidates to zero.
        """
        self.total_votes = 0
        for candidate in self.candidates.keys():
            self.candidates[candidate]["votes"] = 0