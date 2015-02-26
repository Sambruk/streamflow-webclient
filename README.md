# Streamflow Webclient

**Important:** As of 2015-02-19 the webclient was broken off into its own
repository, meaning previous history will be erased. If you need someone to
`git-blame` for something in particular, previous history will be available in
[the core repository](https://github.com/jayway/streamflow-core/), starting at
[this commit](https://github.com/jayway/streamflow-core/commit/930d7201cfd47424acacf434857928719c9ebf3://github.com/jayway/streamflow-core/commit/930d7201cfd47424acacf434857928719c9ebf35).

## Getting Started

### GUI Submodule

This project has its CSS stored in a submodule. Do the following:

```bash
git submodule update --init
cd app/design
git checkout develop
```

### Install Dependencies & Build

External dependencies are installed via `npm` and `bower`. Lastly
[gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md)
will handle the build process (minification, uglification, etc.).

```bash
cd ~/path/to/streamflow-webclient
git checkout develop
npm install
bower install
gulp
```

The built application ends up in the `build/` directory and is served on
[localhost:9999](http://localhost:9999) (go ahead, click it!).

### Running Tests

Tests can be run with the following commands:

```bash
gulp unit-test
gulp e2e-test
```

## Deployment

Maven is used to build the complete project. It can be downloaded from
[here](http://maven.apache.org/download.cgi) or installed via Homebrew (Mac):

```bash
brew install maven
```

Make sure you have all the latest changes.

In the root directory type:

```bash
mvn clean install
```

The build process should start and will create a `.war` file in the `target/` directory.

### Glassfish

Glassfish is the web server hosting Streamflow, located
[here](https://test-sfwc.jayway.com:4848). Account details can be found
[here](https://confluence.jayway.com/display/streamsource/Windows+server+tips+and+tricks).

Do the following to finish deployment:

* Click **Applications** in the sidebar.

* Select the checkbox next to the existing deployed application and then click
  **Undeploy**.

* Click **Deploy** and select the new application `.war` file.

* Remote desktop to:

  ```bash
  test-sfwc.jayway.com
  ```

* Edit `WEB-INF/web.xml`. Comment out:

  ```bash
  <param-value>http://localhost/streamflow</param-value>`
  ```

* and then uncomment:

  ```bash
  <param-value>http://test-sf.jayway.com/streamflow</param-value>`
  ```

* Go back to Glassfish and **Reload** the deployed application.

## Coding Conventions

Good looking code is important. Keep `jshint` happy, and try to follow these
simple rules:

* End files with a newline
([but why?!](http://stackoverflow.com/questions/729692/why-should-files-end-with-a-newline)).

* Use whitespaces to increase legibility:

  ```javascript
  // Do
  addFunc(function (val) {
    return val + val;
  });

  // Don't
  addFunc(function(val){
    return val+val;
  });
  ```

* Don't leave behind `console.log` or `debugger` statements.

* Don't commit half-finished implementations.

* Don't repeat yourself ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)).

