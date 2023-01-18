// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import { BillingStack } from '../lib/billing-stack';
// import * as Pipeline from '../lib/pipeline-stack';
// import { ServiceStack } from '../lib/service-stack';

// // example test. To run these tests, uncomment this file along with the
// // example resource in lib/pipeline-stack.ts
// test('SQS Queue Created', () => {
//  const app = new cdk.App();
// //     // WHEN
//   const stack = new Pipeline.PipelineStack(app, 'MyTestStack');
// //     // THEN
//   const template = Template.fromStack(stack);
//   // expect(template.toJSON()).toMatchSnapshot();
//   // template.hasResourceProperties('AWS::SQS::Queue', {
//   //   VisibilityTimeout: 300
//   // });
// });
// test("Adding service stage", () => {
//   // GIVEN
//   const app = new cdk.App();
//   const serviceStack = new ServiceStack(app, "ServiceStack", {
//     stageName: "Test",
//   });
//   const pipelineStack = new Pipeline.PipelineStack(app, "PipelineStack");

//   // WHEN
//   pipelineStack.addServiceStage(serviceStack, "Test");

//   // THEN
//   // expectCDK(pipelineStack).to(
//   //   haveResourceLike("AWS::CodePipeline::Pipeline", {
//   //     Stages: arrayWith(
//   //       objectLike({
//   //         Name: "Test",
//   //       })
//   //     ),
//   //   })
//   // );
//   // const testStage = pipelineStack.addServiceStage(serviceStack, "Test");
// });
// // test("Adding billing stack to a stage", () => {
// //   // GIVEN
// //   const app = new cdk.App();
// //   const serviceStack = new ServiceStack(app, "ServiceStack", {
// //     stageName: "Test",
// //   });
// //   const pipelineStack = new Pipeline.PipelineStack(app, "PipelineStack");
// //   const billingStack = new BillingStack(app, "BillingStack", {
// //     budgetAmount: 5,
// //     emailAddress: "test@example.com",
// //   });
// //   const testStage = pipelineStack.addServiceStage(serviceStack, "Test");

// //   // WHEN
// //   // pipelineStack.addBillingStackToStage(billingStack, testStage);

// //   // THEN
// //   // expectCDK(pipelineStack).to(
// //   //   haveResourceLike("AWS::CodePipeline::Pipeline", {
// //   //     Stages: arrayWith(
// //   //       objectLike({
// //   //         Actions: arrayWith(
// //   //           objectLike({
// //   //             Name: "Billing_Update",
// //   //           })
// //   //         ),
// //   //       })
// //   //     ),
// //   //   })
// //   // );
// // });
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Pipeline from '../lib/pipeline-stack';
import { ServiceStack } from '../lib/service-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/pipeline-stack.ts
test('SQS Queue Created', () => {
 const app = new cdk.App();
//     // WHEN
  const stack = new Pipeline.PipelineStack(app, 'MyTestStack');
//     // THEN
  const template = Template.fromStack(stack);
  // expect(template.toJSON()).toMatchSnapshot();
  // template.hasResourceProperties('AWS::SQS::Queue', {
  //   VisibilityTimeout: 300
  // });
});
test("Adding service stage", () => {
  // GIVEN
  const app = new cdk.App();
  const serviceStack = new ServiceStack(app, "ServiceStack", {
    stageName: "Test",
  });
  const pipelineStack = new Pipeline.PipelineStack(app, "PipelineStack");

  // WHEN
  // pipelineStack.addServiceStage(serviceStack, "Test");
  const testStage = pipelineStack.addServiceStage(serviceStack, "Test");

  // THEN
  // expectCDK(pipelineStack).to(
  //   haveResourceLike("AWS::CodePipeline::Pipeline", {
  //     Stages: arrayWith(
  //       objectLike({
  //         Name: "Test",
  //       })
  //     ),
  //   })
  // );
});