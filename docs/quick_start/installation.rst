Installation of Streamflow webclient
====================================

#. First download **.war** file from needed release at `GitHub <https://github.com/Sambruk/streamflow-webclient/releases/>`_

#. Deploy downloaded file to application server with path ``/webclient``. No other special actions needed. If you need help you can read `Server part setup <https://streamflow-core.readthedocs.io/en/latest/quick_start/installation.html/>`_

    .. important::
        It's important to use exactly context path or it will not connect to streamflow-core. If you need to change it refer to :doc:`short-dev-guide`

#. Update server path (Optional)

        By default it configured to use ``http://localhost/streamflow`` as server path. There is two ways to change it.

        **Before deployment**


                #. Open *.war* file with achiever and change file ``/WEB-INF/web.xml`` with needed address (URL or IP address) to the Streamflow server API

                        .. code-block:: xml

                                <param-name>targetUri</param-name>
                                <param-value>http://localhost/streamflow</param-value>

                #. Update archive
                #. Start from step 1 above)


        **After deployment**

                #. Connect to server (RDP or SSH don't care)
                #. Open web.xml located in

                        * [glassfish-home] /glassfish/domains/domain1/applications/streamflow-web-client.x.x/WEB-INF/
                        * [tomcat-home] /webapps/streamflow-web-client.x.x/WEB-INF/.
                #. Change it with needed address (URL or IP address) to the Streamflow server API

                        .. code-block:: xml

                                <param-name>targetUri</param-name>
                                <param-value>http://localhost/streamflow</param-value>
                #. Save it.
                #. Reload it on application server

                        * At Glassfish's admin console go to Applications. Select 'Reload' for the deployed web application streamflow webclient-x.x. The page indicates that a restart of the web application is being performed.
                        * At Tomcat manager press 'Reload' for the deployed web application streamflow webclient-x.x.

                #. Reload of the application may take a few minutes. Test by opening a browser window and going to the server's URL / IP address followed by "/ webclient":
