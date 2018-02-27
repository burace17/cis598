from forecaster.result import Result
import pytest
class TestResult:
    """
    Unit test for the Result class 
    """
    def setup_method(self):
        """
        Initialize unit tests
        """
        self.result = Result(["Candidate1","Candidate2","Candidate3"])
        self.empty_result = Result([])

    def test_add_votes_invalid_candidate(self):
        """
        Adding votes for a candidate that does not exist should raise a ValueError
        """
        with pytest.raises(ValueError):
            self.empty_result.add_votes("test", 5)
        with pytest.raises(ValueError):
            self.result.add_votes("Candidatex", 1)

    def test_add_votes_updates_count(self):
        """
        Adding votes for a candidate updates the actual count stored in the object
        """
        self.result.add_votes("Candidate2", 5)
        assert self.result.candidates["Candidate2"] == 5

        self.result.add_votes("Candidate3", 3)
        assert self.result.candidates["Candidate3"] == 3
        assert self.result.candidates["Candidate2"] == 5

    def test_get_votes_invalid_candidate(self):
        """
        Attempting to get the number of votes for an invalid candidate raises ValueError
        """
        with pytest.raises(ValueError):
            self.empty_result.get_votes("Candidate1")
        with pytest.raises(ValueError):
            self.result.get_votes("Candidatex")

    def test_get_votes_retrieves_vote_count(self):
        """
        get_votes() returns the correct number of votes for a given candidate
        """

        # Initial value is zero
        assert self.result.get_votes("Candidate1") == 0
        assert self.result.get_votes("Candidate2") == 0
        assert self.result.get_votes("Candidate3") == 0

        # Does adding work?
        self.result.add_votes("Candidate1", 2)
        assert self.result.get_votes("Candidate1") == 2
        self.result.add_votes("Candidate1", 2)
        assert self.result.get_votes("Candidate1") == 4

        # Were the other candidates affected?
        assert self.result.get_votes("Candidate2") == 0
        assert self.result.get_votes("Candidate3") == 0

    def test_get_percentage_invalid_candidate(self):
        """
        Attempting to get the percentage of votes for an invalid candidate raises ValueError
        """
        with pytest.raises(ValueError):
            self.empty_result.get_percentage("Candidate1")
        with pytest.raises(ValueError):
            self.result.get_percentage("Candidatex")

    def test_get_percentage_returns_correct_percent(self):
        """
        get_percentage() returns the correct percentage of the final votes for a given candidate
        """
        assert self.result.get_percentage("Candidate1") == 0.0
        assert self.result.get_percentage("Candidate2") == 0.0
        assert self.result.get_percentage("Candidate3") == 0.0

        self.result.add_votes("Candidate1", 253)
        self.result.add_votes("Candidate2", 106)
        self.result.add_votes("Candidate3", 56)

        total = 253 + 106 + 56
        assert self.result.get_percentage("Candidate1") == (253 / total)
        assert self.result.get_percentage("Candidate2") == (106 / total)
        assert self.result.get_percentage("Candidate3") == (56 / total)


    def test_get_total_votes_returns_correct_total(self):
        """
        get_total_votes() actually returns the total number of votes
        """
        assert self.result.get_total_votes() == 0
        assert self.empty_result.get_total_votes() == 0

        self.result.add_votes("Candidate1", 210)
        self.result.add_votes("Candidate1", 26)
        self.result.add_votes("Candidate3", 90)

        assert self.result.get_total_votes() == 210 + 26 + 90

        
