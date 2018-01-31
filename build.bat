@REM
@REM
@REM Copyright
@REM 2009-2015 Jayway Products AB
@REM 2016-2018 Föreningen Sambruk
@REM
@REM Licensed under AGPL, Version 3.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM     http://www.gnu.org/licenses/agpl.txt
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.
@REM

::
::
:: Copyright 2009-2015 Jayway Products AB
::
:: Licensed under the Apache License, Version 2.0 (the "License");
:: you may not use this file except in compliance with the License.
:: You may obtain a copy of the License at
::
::     http://www.apache.org/licenses/LICENSE-2.0
::
:: Unless required by applicable law or agreed to in writing, software
:: distributed under the License is distributed on an "AS IS" BASIS,
:: WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
:: See the License for the specific language governing permissions and
:: limitations under the License.
::
::
:: NB!
:: Remember to change build.sh if any changes are done in this file


call npm install

call bower install

call gulp clean

call gulp build --prod
