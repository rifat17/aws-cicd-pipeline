#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GitPipelineStack } from '../lib/git-pipeline-stack';

const app = new cdk.App();
new GitPipelineStack(app, 'GitPipelineStack', {

});