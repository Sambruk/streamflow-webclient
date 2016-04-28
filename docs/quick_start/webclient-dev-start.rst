Installation of Streamflow webclient
============


#. Checkout
#. Go to the check out directory and execute following commands from terminal 

    .. code-block:: bash

        git submodule update --init
        cd app/design
        git checkout develop

    .. tip::
If you can't complete last step go to `streamflow-webclient-gui <https://github.com/jayway/streamflow-webclient-gui>`_ and check out to **app/design** folder

#. Execute folowing commands in terminal

    .. code-block:: bash

        sudo apt-get install npm
        sudo apt-get install nodejs-legacy
        sudo npm install -g bower
        sudo npm install gulp -g

Dev start
------------------

#. Add following chrome extension `Allow-Control-Allow-Origin plugin <https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi>`_

#. Change **AuthentificatorFilterService** class at **streamflow-core** project.

	* Comment lines at *130-139* and *249*

		.. code-block:: java
		     :linenos:
    		     :lineno-start: 130


    		     if (challengeResponse == null)
    		     {
    		        response.setStatus(Status.CLIENT_ERROR_UNAUTHORIZED);
    		        response.getChallengeRequests().add(new ChallengeRequest(ChallengeScheme.HTTP_BASIC, "Streamflow"));
    		        return Filter.STOP;
    		     } else
    		     {
    		        String username = challengeResponse.getIdentifier();
    		        String password = new String(challengeResponse.getSecret());

    		.. code-block:: java
		     :linenos:
    		     :lineno-start: 248

    		      			return Filter.CONTINUE;
    					}
          			}

    	* Add following lines under line *139*

		.. code-block:: java
		     :linenos:
    		     :lineno-start: 140

    			String username = "administrator";
    		       	String password = "administrator";

    #. Change **http-service.js** at line *46* of **streamflow-webclient** project
	* Change

	.. code-block:: javascript

		return 'https://test-sf.jayway.com/streamflow/';
        	//return 'http://localhost:8082/streamflow/';

	* To:

	.. code-block:: javascript

		//return 'https://test-sf.jayway.com/streamflow/';
        	return 'http://localhost:8082/streamflow/';

#. Execute folowing commands from webclient folder:

	.. code-block:: bash

		npm install
		bower install

	* You can quick start webclient executing folowing

	.. code-block:: bash

		gulp

	.. note::
	It will be runned at *localhost:9999* by default

Prod start
------------------

#. Execute folowing commands from webclient folder:

	.. code-block:: bash

		npm install
		bower install

    * Change following files
    	*Change **http-service.js** at line *40* of **streamflow-webclient** project

            .. code-block:: javascript
		:linenos:
    		:lineno-start: 40

                    var prodUrl = urlPrefix + '://' + host +':'+ port + '/webclient/api/';

            *To:

                .. code-block:: javascript
		:linenos:
    		:lineno-start: 40

                    var prodUrl = urlPrefix + '://' + host +':'+ port + '/streamflow/webclient/api/';

            *Change **logindirective.js** at line *38* of **streamflow-webclient** project

            .. code-block:: javascript
		:linenos:
    		:lineno-start: 38

                    url= $location.$$protocol + '://username:password@' + $location.$$host + ':' + $location.$$port + '/webclient/api';

            *To:

                .. code-block:: javascript
		:linenos:
    		:lineno-start: 38

                    url= $location.$$protocol + '://username:password@' + $location.$$host + ':' + $location.$$port + '/streamflow/webclient/api';

    	*Then you need to create war for further run

    		.. code-block:: bash

			maven clean install

	.. note:
Executing maven command will create **.war* file at */target/* folder of webclient folder. You can deploy it on web server

    .. important::
Entire project must be launched at one host and port or at least it must be seen as deployed in this way using apache for example to avoid CORS and other location exception.
        Following root path must be used:

        * **streamflow-web** - */streamflow*
        * **streamflow-webclient** - */*

    Now you are free to use streamflow web client

.. important::
That tutorial not final, and will be appended further.
