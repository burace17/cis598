class ResultReader:
    """
    This is an abstract class that describes an object that can check for new election results from a data source
    This data source could be anything. For a live election, this object would likely scrape results from the
    state's Secretary of State website. However, for simulation purposes, it could simply read a file with existing
    results from the file system.
    """

    def check_for_new_results(self):
        """
        Query the data source for new results.
            :return: A Result object containing the new results. If there are no new results, the function should return None
        """
        raise NotImplementedError
