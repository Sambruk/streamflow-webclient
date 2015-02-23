# Streamflow Webclient

**Important:** As of 2015-02-19 the webclient was broken off into its own repository,
  meaning previous history will be erased. If you need someone to `git-blame` for something
  in particular, previous history will be available in [the core repository](https://github.com/jayway/streamflow-core/),
  starting at [this commit](https://github.com/jayway/streamflow-core/commit/930d7201cfd47424acacf434857928719c9ebf3://github.com/jayway/streamflow-core/commit/930d7201cfd47424acacf434857928719c9ebf35).

## Getting Started

```bash
cd ~/path/to/streamflow-webclient
git checkout develop
npm install
bower install
gulp
```

The application is served on [localhost:9999](http://localhost:9999) (go ahead, click it!).

## Build System

Streamflow is using the build tool [gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md).

There are different tasks for different purposes but the `gulp` command runs all
the neccessary ones.

Tasks that are not being run by default are:

```bash
gulp unit-test
gulp e2e-test
```

Gulp will by default build to the `build/` folder.

## Submodules

This project uses a submodule, it needs to be initiated with:

```bash
git submodule update --init
cd app/design
git checkout develop
```

## Deployment

We're using maven to build the complete project. Download [here](http://maven.apache.org/download.cgi) or install via Homebrew (Mac):

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

Redeploy the new `.war` file at [test-sfwc.jayway.com:4848](https://test-sfwc.jayway.com:4848) under `Applications`. Account details could be found [here](https://confluence.jayway.com/display/streamsource/Windows+server+tips+and+tricks).

Remote desktop to:

```bash
test-sfwc.jayway.com
```

Edit `WEB-INF/web.xml`. Comment out:

```bash
<param-value>http://localhost/streamflow</param-value>`
```

and uncomment:

```bash
<param-value>http://test-sf.jayway.com/streamflow</param-value>`
```

Go back to Glassfish and **Reload deployed application**.

