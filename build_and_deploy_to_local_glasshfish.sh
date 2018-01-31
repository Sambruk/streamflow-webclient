#!/bin/bash
#
#
# Copyright
# 2009-2015 Jayway Products AB
# 2016-2018 Föreningen Sambruk
#
# Licensed under AGPL, Version 3.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.gnu.org/licenses/agpl.txt
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


###########
#This script...
#... builds webclient war
#... deploys it to local Glassfish installation
#... changes proxy API url to desired url
#
#Please feel free to improve it!
#
#NB! You need a local Glassfish installation with the default domain started.
###########

## TODO: check if glassfish is running
## TODO: parameterize API url, Glassfish location, version
## TODO: sed - "3rd line after line with proxy class"

## Variables
LOCAL_GLASSFISH=''
APPLICATION_VERSION=''
API_URL=''
CONTEXT_ROOT=webclient

## Usage
usage="usage: $0 [-v VERSION_NAME] [-u API_URL] [-g GLASSFISH_PATH] [-h] 
$option -v application version name (e.g. 1.0-SNAPSHOT) 
$option -u url to desired api (e.g. http://test-sf.jayway.com/streamflow)
$option -g path to local Glassfish installation (e.g. /Applications/Glassfish/glassfish4) 
$option -h prints this help"

while getopts "v:u:g:h" opt
do
    case $opt in
    v ) APPLICATION_VERSION=$OPTARG ;;
    u ) API_URL=$OPTARG ;;
    g ) LOCAL_GLASSFISH=$OPTARG ;;
    h ) echo "$usage"
        exit 0 ;;
    \?) echo "$usage"
        exit 2 ;;
    esac
done
shift $((OPTIND-1))

## Check arguments
if [ -z ${APPLICATION_VERSION} ]; then
    echo "You must provide version to build and deploy (VERSION_NAME)"
    echo "$usage"
    exit 2
fi
if [ -z ${API_URL} ]; then
    echo "You must provide url to API that proxy should connect to (API_URL)"
    echo "$usage"
    exit 2
fi
if [ -z ${LOCAL_GLASSFISH} ]; then
    echo "You must provide path to local Glassfish installation (GLASSFISH_PATH)"
    echo "$usage"
    exit 2
fi

APPLICATION_NAME=streamflow-webclient-${APPLICATION_VERSION}

echo ":::: *** Build and deploy to local glassfish *** ::::"
echo ":::: Using Application version name: ${APPLICATION_VERSION}"
echo ":::: Using API url: ${API_URL}"
echo ":::: Using Glassfish path: ${LOCAL_GLASSFISH}"


## Build application
echo ":::: Step: Build application ::::"
mvn clean install
 
## Deploy application in local Glassfish
echo ":::: Step: Deploy war file ${APPLICATION_NAME}.war ::::"
${LOCAL_GLASSFISH}/bin/asadmin deploy --force=true --contextroot=${CONTEXT_ROOT} target/${APPLICATION_NAME}.war

## Disable application
echo ":::: Step: Disable application ::::"
${LOCAL_GLASSFISH}/bin/asadmin disable ${APPLICATION_NAME}

## Change proxy API url
echo ":::: Step: Set proxy API url to ${API_URL} ::::"
sed -i '' "s#http://localhost/streamflow#${API_URL}#g" ${LOCAL_GLASSFISH}/glassfish/domains/domain1/applications/${APPLICATION_NAME}/WEB-INF/web.xml

## Enable application
echo ":::: Step: Enable application ::::"
${LOCAL_GLASSFISH}/bin/asadmin enable ${APPLICATION_NAME}

echo ":::: Streamflow webclient is now available at http://localhost:8080/${CONTEXT_ROOT} ::::"