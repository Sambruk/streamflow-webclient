Developer cheatsheet
####################

Here are some tricks which can help during development

Authentification
****************
In order to not promt user credentials each time and be able to launch on different port/server from streamflow-core required following:

At streamflow-core you should disable authorization

#. Change **AuthentificatorFilterService** class at **streamflow-core** project.

    * Comment lines at *130-138* and *249*

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

    * Update following lines under line *139* with

    .. code-block:: java
        :linenos:
        :lineno-start: 140

        String username = "administrator";
        String password = "administrator";

Server path
***********

Can be a case that you want to use another ports or even application servers. To update paths at webclient  needed just to update path to server.

Develop mode
------------

Change **http-service.js** URL at line *46* of **streamflow-webclient** project

    .. code-block:: javascript
        :linenos:
        :lineno-start: 46

        return 'https://test-sf.jayway.com/streamflow/';
        //return 'http://localhost:8082/streamflow/';

Production mode
---------------

Change in **http-service.js** URL at line *39* of **streamflow-webclient** project

    .. code-block:: javascript
        :linenos:
        :lineno-start: 39

        var prodUrl = urlPrefix + '://' + host +':'+ port + '/webclient/api/';