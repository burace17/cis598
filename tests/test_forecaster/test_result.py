from cis598.forecaster.result import Result
import pytest
class TestResult:
    """
    Unit test for the Result class 
    """
    def setup_method(self):
        """
        Initialize unit tests
        """
        self.candidates_dict = {
            "Candidate1": { "display_name": "Candidate 1", "party":"Party 1", "votes":0},
            "Candidate2": { "display_name": "Candidate 2", "party":"Party 2", "votes":0},
            "Candidate3": { "display_name": "Candidate 3", "party":"Party 2", "votes":0}
        }
        self.result = Result(self.candidates_dict, "Test")
        self.empty_result = Result({}, "Empty")

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
        assert self.result.candidates["Candidate2"]["votes"] == 5

        self.result.add_votes("Candidate3", 3)
        assert self.result.candidates["Candidate3"]["votes"] == 3
        assert self.result.candidates["Candidate2"]["votes"] == 5

    def test_add_operator_updates_count(self):
        """
        Adding votes using the addition operator updates the actual count
        """
        self.result.add_votes("Candidate2", 17)
        self.result.add_votes("Candidate3", 46)

        tmp = Result(self.candidates_dict, "Temp")
        tmp.add_votes("Candidate1", 462)
        tmp.add_votes("Candidate2", 1)
        tmp.add_votes("Candidate3", 193)

        self.result += tmp
        assert self.result.candidates["Candidate1"]["votes"] == 462
        assert self.result.candidates["Candidate2"]["votes"] == 18
        assert self.result.candidates["Candidate3"]["votes"] == 193 + 46
        
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

    def test_get_result_summary_returns_dictionary(self):
        assert isinstance(self.empty_result.get_summary(), dict)
        self.result.add_votes("Candidate1", 43)
        self.result.add_votes("Candidate2", 6)
        self.result.add_votes("Candidate3", 913)

        summary = self.result.get_summary()
        assert isinstance(summary, dict)
        assert summary["Candidate1"]["votes"] == 43
        assert summary["Candidate2"]["votes"] == 6
        assert summary["Candidate3"]["votes"] == 913
        
    def test_get_percentage_summary_returns_dictionary(self):
        assert isinstance(self.empty_result.get_percentage_summary(), dict)
        self.result.add_votes("Candidate1", 74)
        self.result.add_votes("Candidate2", 32)
        self.result.add_votes("Candidate3", 12)
        
        summary = self.result.get_percentage_summary()
        total = self.result.get_total_votes()
        assert isinstance(summary, dict)
        assert summary["Candidate1"] == 74 / total
        assert summary["Candidate2"] == 32 / total
        assert summary["Candidate3"] == 12 / total

    def test_get_name_returns_name(self):
        assert self.result.get_name() == "Test"
        assert self.empty_result.get_name() == "Empty"