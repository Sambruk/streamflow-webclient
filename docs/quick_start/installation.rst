Installation of Streamflow webclient
====================================

#. First download **.war** file from needed release at `GitHub <https://github.com/Sambruk/streamflow-webclient/releases/>`_

#.  Deploy downloaded file to application server. No other special actions needed. If you need help you can read `Server part setup <https://streamflow-core.readthedocs.io/en/latest/quick_start/installation.html/>`_

    .. note::
        You can choose any context name or event with it. It's not important.

    .. important::
        Server should be accessible at same host by following relative path **/webclient/api/**

    .. important::
        Webclient must be launched at one host and port where server(**streamflow-core**) does or at least it must be seen as deployed in this way using apache for example to avoid `CORS <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/>`_ and other path exception