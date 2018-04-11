from .result_reader import ResultReader
from .result import Result

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
        self.result_reader = result_reader

    def get_forecast(self):
        """
            Gets the predicted outcome of the election as predicted by the forecasting algorithm using the results that have been counted so far.
                :return: A Result object containing the model's prediction for the final election outcome. 
        """
        raise NotImplementedError

    def get_actual_count(self):
        """
            Gets the actual election results that have been counted so far 
                :return: A Result object containing the actual election result as they have been counted.
        """
        raise NotImplementedError

    def update_forecast(self):
        """
           Updates the forecast by requesting more results from the result reader connected to this model
        """
        raise NotImplementedError