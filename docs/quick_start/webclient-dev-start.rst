Installation of Streamflow webclient(DRAFT)
============


#. Checkout
#. Go to the check out directory and execute following commands from terminal 
    .. code-block:: terminal
        git submodule update --init
        cd app/design
        git checkout develop

    .. note::
    If you can complete this go to *https://github.com/jayway/streamflow-webclient-gui* and check out to app/design folder

#. Execute folowing commands in terminal
    .. code-block:: 
        sudo apt-get install npm
        sudo apt-get install nodejs-legacy
        sudo npm install -g bower
        sudo npm install gulp -g
    
#. Change **AuthentificatorFilterService** class at **streamflow-core** project. 
	* Comment lines at *130-139* and *249*
		.. code-block:: java
		     if (challengeResponse == null)
		     {
		        response.setStatus(Status.CLIENT_ERROR_UNAUTHORIZED);
		        response.getChallengeRequests().add(new ChallengeRequest(ChallengeScheme.HTTP_BASIC, "Streamflow"));
		        return Filter.STOP;
		     } else
		     {
		        String username = challengeResponse.getIdentifier();
		        String password = new String(challengeResponse.getSecret());
	    
	* Add folowing lines under line *139*
		.. code-block:: java
			String username = "administrator";
			String password = "administrator";    

#. Change **http-service.js** at line *46* of **streamflow-webclient** project
	* Change
	.. code-block:: js
		return 'https://test-sf.jayway.com/streamflow/';
        	//return 'http://localhost:8082/streamflow/';

	To:

	.. code-block:: js
		//return 'https://test-sf.jayway.com/streamflow/';
        	return 'http://localhost:8082/streamflow/';

	.. important::
		If you wan to make war comment line *44* too

		.. code-block:: js
			return prodUrl;

#. Add folowing chrome extension *https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi*

#. Execute folowing commands from webclient folder:
	
	.. code-block:: terminal
		npm install
		bower install

	*You can quick start webclient executing folowing

	.. code-block:: terminal
		gulp

	.. note::
	It will be runned at *localhost:9999* by default

	*If you want to create war for further run 
		
		.. code-block:: terminal
			maven clean install
		
	.. note: 
	Executing maven command will create **.war* file at */target/* folder of webclient 		folder. You can deploy it on web server

.. important::
That tutorial only for testing purposes, and will be appended further.
