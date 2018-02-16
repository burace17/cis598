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
            :return: A dictionary with keys corresponding with a candidate or political party and values corresponding 
                 with the number of votes that candidate or political party received. The key names should be the same
                 as the names defined in the global configuration file.
        """
        pass
