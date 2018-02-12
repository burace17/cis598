from .result_reader import ResultReader
class Model:
    """
        Abstract class that describes an object that predicts the outcome of an election using an algorithm.
    """

    def __init__(self, result_reader):
        """
           Initializes the forecasting model with the given result reader object.
           :param result_reader: A ResultReader object that will read the actual election results.
        """
        assert isinstance(result_reader, ResultReader)

    def get_forecast(self):
        """
            Gets the predicted outcome of the election as predicted by the forecasting algorithm using the results
            that have been counted so far.

            :return: A dictionary with keys that correspond to the candidates or political parties in this election
                     and values corresponding with the percentage of the final vote each candidate or political party
                     is expected to receive when all votes have been counted.
        """
        pass

    def get_actual_count(self):
        """
           Gets the actual election results that have been counted so far 
            :return: A dictionary with keys that correspond to the candidates or political parties in this election
                     and values corresponding with the percentage of the votes counted for each candidate or political party.
        """
        pass

    def update_forecast(self):
        """
           Updates the forecast by requesting more results from the result reader connected to this model
           :return: Does not return anything
        """
        pass
