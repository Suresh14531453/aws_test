#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { BillingStack } from '../lib/billing-stack';
import { ServiceStack } from '../lib/service-stack';

const app = new cdk.App();
const pipelineStack=new PipelineStack(app, 'PipelineStack', {});
// const serviceStackProd = new ServiceStack(app, "ServiceStackProd");
const serviceStackTest = new ServiceStack(app, "ServiceStackTest", {
  stageName: "Test",
});
const serviceStackProd = new ServiceStack(app, "ServiceStackProd", {
  stageName: "ServiceStackProd",
});

// new BillingStack(app, "BillingStack", {
//   budgetAmount: 5,
//   emailAddress: "sureshsahu1453@gmail.com",
// });
// pipelineStack.addServiceStage(serviceStackProd,"service")
pipelineStack.addServiceStage(serviceStackTest, "Test");
pipelineStack.addServiceStage(serviceStackProd, "ServiceStackProd");

