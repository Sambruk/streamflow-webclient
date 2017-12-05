Short developer's guide
=======================

Getting Started
***************

#. You need to check out project from `GitHub repository <https://github.com/Sambruk/streamflow-webclient.git/>`_

#. Go to the check out directory and execute following commands from terminal.

    All style stuff is stored at external repository `GUI <https://github.com/jayway/streamflow-webclient-gui/>`_

    .. note::
        This step is optional but without gui it will quite ugly )

    .. code-block:: bash

        git submodule update --init
        cd app/design
        git checkout develop

    .. hint::
        If you can't complete last step go to `streamflow-webclient-gui <https://github.com/jayway/streamflow-webclient-gui>`_ and check out it to **app/design** folder

#. You should fetch needed build dependencies

    .. code-block:: bash

        cd ~/path/to/streamflow-webclient
        git checkout develop
        npm install
        bower install

    .. important::
        ``npm`` and ``bower`` should be installed

        * There is no support for newer *nodejs* (*6.11.4* for now) bundled at npm.
        * To be able to built project you should have NodeJs v4 (tested at **4.72**)
        * In case of linux based environment you will need installed ``nodejs-legacy`` package as well

    .. hint::
        It would be useful to install ``bower`` and ``gulp`` packets globally for all system. You can do this by following commands

        .. code-block:: bash

            sudo npm install -g bower
            sudo npm install -g gulp

#. Now you have all needed stuff to build webclient

Installation and running locally
********************************

* By executing previously commands you should obtain tool called `Gulp <https://github.com/gulpjs/gulp/blob/master/docs/README.md/>`_

    It will handle the build process (minification, uglification, etc.).

    You can simply run it from project directory

    .. code-block:: bash

        gulp

    It will built application at the **build/** directory and is served on `localhost:9999 <http://localhost:9999/>`_ (go ahead, click it!).

* Tests
    To run test you can run following commands from terminal

    .. code-block:: bash

        gulp unit-test
        gulp e2e-test

    .. note::
        Unit tests are running automatically during gulp build

Deployment and releasing
*************************

#. Maven is used to build the complete project and create deployable **.war** file.
    Maven can be downloaded from `here <http://maven.apache.org/download.cgi/>`_ or installed via aptitude (Linux):

    .. code-block:: bash

        sudo apt-get install maven


#. Make sure you have all the latest changes.

#. You may wish to change default proxy mapping for server (Optional)

    To do that modify ``targetUri`` parameter in **web.xml** located at **../WEB-INF/web.xml** with following

    .. code-block:: xml

        <param-name>targetUri</param-name>
        <param-value>http://localhost/streamflow</param-value>

#. In the root directory type:

    .. code-block:: bash

        mvn clean install

    The build process should start and will create a `.war` file in the `target/` directory.


Running
*******
To run simply use following command from project root.

    .. code-block:: bash

        gulp -dev

or even

    .. code-block:: bash

        gulp

For prod mode use

    .. code-block:: bash

        gulp -prod

Coding Conventions
******************

Good looking code is important. Keep `jshint` happy (or at least try), and try to follow these
simple rules:

* End files with a newline `but why?! <http://stackoverflow.com/questions/729692/why-should-files-end-with-a-newline/>`_

* Use whitespaces to increase legibility:

    .. code-block:: javascript

        // Do
        addFunc(function (val) {
            return val + val;
        });

        // Don't
        addFunc(function(val){
            return val+val;
        });

* Don't leave behind ``console.log`` or ``debugger`` statements.

* Don't commit half-finished implementations.

* Don't repeat yourself `DRY <https://en.wikipedia.org/wiki/Don%27t_repeat_yourself/>`_

.. important::
    That tutorial not final, and will be appended further.
