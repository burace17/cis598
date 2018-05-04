.. election-forecaster documentation master file, created by
   sphinx-quickstart on Mon Feb 12 13:41:30 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to election-forecaster's documentation!
===============================================

election-forecaster is a platform that allows one to host their election forecasting platforms.
It provides a React-based frontend which shows users the current election results, as well as the 
current prediction. 

System Requirements
=====================

For the backend:

*   Python 3
*   Flask 
*   Sphinx (if one wants to build the documentation)
*   Pytest (for running the tests)

For the frontend:

*   A modern web browser (for IE, at least version 11)
*   NPM (or some other package manager to handle JS dependencies)

Quick Start
==================

The respository includes two sample forecasting algorithms. The one it is currently configured to use
forecasts a simulation of the 2014 Kansas gubernatorial election. The other algorithm provided forecasts
the results of the 2018 special election in Pennsylvania's 18th congressional district. This algorithm includes
code which retrieves the actual results directly from the Secretary of State's website. It is a good starting point
for developing your own ResultReader implementations. 

To start the platform using the 'kansas-forecaster', one can type the following at a terminal::

    ./start.sh 

This will startup the Flask-based backend server which retrieves the data and runs the algorithm. The frontend will
request updates using this server. These services do not have to run on the same machine. 

To startup the frontend server, one can type the following at a terminal::

    cd client
    react-scripts-ts start

Your default browser should open with the platform's frontend. 

Configurating the platform
==============================

Configuration for the election forecaster is split into two parts: the backend and the frontend. As mentioned earlier,
the backend controls the algorithm itself and how it retrieves data. The frontend configuration will control what the 
user sees. 

For the backend, one should modify ``config.py`` in the root of the repository. Below is a description of the options 
available in this file.

=============   =========================================  =============================================================
Name            Default Value                              Description
=============   =========================================  =============================================================
model           cis598.kansas_forecaster.kansas_model      Module path to the file containing the forecasting algorithm
result_reader   cis598.kansas_forecaster.simulation        Module path to the file containing the result reader
model_class     KansasModel                                Actual Python class name of the forecasting alogorithm
reader_class    SimulatedElection                          Actual Python class name of the result reader
=============   =========================================  =============================================================

There is also a ``candidates`` option available which allows one to specify the candidates being tracked in this election. 
It is stored as a dictionary, which maps keys to values. The keys are the candidate names as they are retrieved from the data
source. These names may not be the ones you wish to display to the user. For this reason, the value is actually another 
dictionary, which specifies further options on a per-candidate basis. One of these is the ``displayName`` option. This is
the name that will actually be displayed to the user. You may also specify the ``party`` option which specifies the political
party that candidate is affiliated with. Finally, it is also necessary to specify the ``votes`` option which should be set to zero.
This is used by the platform later on to store the current number of votes for each candidate. 


Forecaster
==================
.. autoclass:: forecaster.result_reader.ResultReader
    :members:
.. autoclass:: forecaster.model.Model
    :members:
.. autoclass:: forecaster.result.Result
    :members:


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

