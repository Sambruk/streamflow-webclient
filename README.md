# Streamflow Webclient

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

We're using maven to build the complete project.
Start by updating the design submodule and then make sure all changes have been commited, pushed and that you have the latest version of the repository (pull).

Then in the root directory folder type:

```bash
mvn clean install
```

The build process should start and this will create a `.war` file in the `target/` directory.
The `pom.xml` describes what happens when we build using Maven.
In the `pom.xml` we reference the `build.sh` (UNIX) or `build.bat` (Windows) script that defines which runs the necessary webclient build steps.

### Glassfish

Redeploy the new `.war` file at [test-sfwc.jayway.com:4848](https://test-sfwc.jayway.com:4848) under `Applications`. Account details could be found [here](https://confluence.jayway.com/display/streamsource/Windows+server+tips+and+tricks).

Remote desktop to:

```
test-sfwc.jayway.com
```

Edit `WEB-INF/web.xml`. Comment out:

```
<param-value>http://localhost/streamflow</param-value>`
```

and uncomment:

```
<param-value>http://test-sf.jayway.com/streamflow</param-value>`
```

Go back to Glassfish and **Reload deployed application**.

