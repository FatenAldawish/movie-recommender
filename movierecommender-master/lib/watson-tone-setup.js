/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

require('dotenv').config({
  silent: true
});

const fs = require('fs'); // file system for loading JSON

/**
 * Setup for Watson Discovery.
 *
 * @param {Object} params - Params needed to
 * @param {Object} callback - Discovery client
 * @constructor
 */
function WatsonToneAnalyzerSetup(toneClient) {
  this.toneClient = toneClient;
}

/**
 * Get the default Discovery configuration.
 * @param {Object} params - Discovery params so far. Enough to get configurations.
 * @return {Promise} Promise with resolve({enhanced discovery params}) or reject(err).
 */
WatsonToneAnalyzerSetup.prototype.getToneAnalyzerConfig = function(params) {
  return new Promise((resolve, reject) => {
    this.toneClient.getConfigurations(params, (err, data) => {
      if (err) {
        console.error(err);
        return reject(new Error('Failed to get Tone analyzer configurations.'));
      } else {
        const configs = data.configurations;
        for (let i = 0, size = configs.length; i < size; i++) {
          const config = configs[i];
          if (config.name === 'Default Configuration') {
            params.configuration_id = config.configuration_id;
            return resolve(params);
          }
        }
        return reject(new Error('Failed to get default Discovery configuration.'));
      }
    });
  });
};

/**
 * Find the Discovery environment.
 * If a DISCOVERY_ENVIRONMENT_ID is set then validate it or error out.
 * Otherwise find it by name (DISCOVERY_ENVIRONMENT_NAME). The by name
 * search is used to find an environment that we created before a restart.
 * If we don't find an environment by ID or name, we'll use an existing one
 * if it is not read_only. This allows us to work in free trial environments.
 * @return {Promise} Promise with resolve({environment}) or reject(err).
 */
WatsonToneAnalyzerSetup.prototype.findToneEnvironment = function(params) {
  return new Promise((resolve, reject) => {
    this.toneClient.getEnvironments(params, (err, data) => {
      if (err) {
        console.error(err);
        return reject(new Error('Failed to get Tone analyzer environments.'));
      } else {
        const environments = data.environments;
        // If a DISCOVERY_ENVIRONMENT_ID is set, validate it and use it (or fail).
        const validateID = process.env.DISCOVERY_ENVIRONMENT_ID;
        // Otherwise, look (by name) for one that we already created.
        const DISCOVERY_ENVIRONMENT_NAME = process.env.DISCOVERY_ENVIRONMENT_NAME || params.default_name;
        // Otherwise we'll reuse an existing environment, if we find a usable one.
        let reuseEnv;

        for (let i = 0, size = environments.length; i < size; i++) {
          const environment = environments[i];
          if (validateID) {
            if (validateID === environment.environment_id) {
              console.log('Found Discovery environment using DISCOVERY_ENVIRONMENT_ID.');
              console.log(environment);
              params.environment_id = environment.environment_id;
              return resolve(params);
            }
          } else {
            if (environment.name === DISCOVERY_ENVIRONMENT_NAME) {
              console.log('Found Discovery environment by name.');
              console.log(environment);
              params.environment_id = environment.environment_id;
              return resolve(params);
            } else if (!environment.read_only) {
              reuseEnv = environment;
            }
          }
        }
        if (validateID) {
          return reject(new Error('Configured DISCOVERY_ENVIRONMENT_ID=' + validateID + ' not found.'));
        } else if (reuseEnv) {
          console.log('Found existing Discovery environment to use: ', reuseEnv);
          params.environment_id = reuseEnv.environment_id;
          return resolve(params);
        }
        // Not found by ID or name or reuse stategy.
        // Set the expected name, so when one is created we will find it.
        params.environment_name = DISCOVERY_ENVIRONMENT_NAME;
        return resolve(params);
      }
    });
  });
};





module.exports = WatsonToneAnalyzerSetup;
