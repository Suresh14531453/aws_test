import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Artifact, IStage, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, GitHubSourceAction,CloudFormationCreateUpdateStackAction, CodeBuildActionType } from 'aws-cdk-lib/aws-codepipeline-actions';
import { SecretValue } from 'aws-cdk-lib';
import { BuildEnvironmentVariableType, BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { ServiceStack } from './service-stack';
import { SnsTopic } from 'aws-cdk-lib/aws-events-targets';
import { EventField, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';




// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PipelineStack extends cdk.Stack {

  private readonly pipeline: Pipeline;
  private readonly cdkBuildOutput: Artifact;
  private readonly serviceBuildOutput: Artifact;
  private readonly serviceSourceOutput: Artifact;
  private readonly pipelineNotificationsTopic: Topic;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.pipelineNotificationsTopic = new Topic(
      this,
      "PipelineNotificationsTopic",
      {
        topicName: "PipelineNotifications",
      }
    );
    this.pipelineNotificationsTopic.addSubscription(
      new EmailSubscription("sureshsahu1453@gmail.com")
    );
   this.pipeline=new Pipeline(this,'Pipeline',{
      pipelineName: "Pipeline",
      crossAccountKeys: false,
      restartExecutionOnUpdate:true,
      
    })
    const cdkSourceOutput = new Artifact("CDKSourceOutput");
    this.serviceSourceOutput=new Artifact("serviceSourceOutput")

  
    this.pipeline.addStage({
      stageName:"Source",
      actions:
      [
       new GitHubSourceAction({
        owner: "Suresh14531453",
        repo: "aws_test",
        branch: "master",
        actionName: "Pipeline_Source",
        oauthToken: SecretValue.secretsManager("git-token"),
        output:cdkSourceOutput
        

       }),

       new GitHubSourceAction({
        owner: "Suresh14531453",
        repo: "Aws_test_backend",
        branch: "master",
        actionName: "Service_Source",
        oauthToken: SecretValue.secretsManager("git-token"),
        output:this.serviceSourceOutput
        

       }),
      
       
      ],
    })




    this.cdkBuildOutput = new Artifact("CdkBuildOutput");
    this.serviceBuildOutput = new Artifact("ServiceBuildOutput");

    this.pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodeBuildAction({
          
          actionName: "CDK_Build",
          input: cdkSourceOutput,
          outputs: [this.cdkBuildOutput],
          project: new PipelineProject(this, "CdkBuildProject", {
            environment: {
              buildImage: LinuxBuildImage.STANDARD_5_0,
            },
            buildSpec: BuildSpec.fromSourceFilename(
              "build-specs/cdk-build-spec.yml"
            ),
          }),
        }),

        new CodeBuildAction({
          actionName: "Service_Build",
          input: this.serviceSourceOutput,
          outputs: [this.serviceBuildOutput],
          project: new PipelineProject(this, "ServiceBuildProject", {
            environment: {
              buildImage: LinuxBuildImage.STANDARD_5_0,
            },
            buildSpec: BuildSpec.fromSourceFilename(
              "build-specs/service-build-spec.yml"
            ),
          }),
        }),
      
      ],
    });


    


    this.pipeline.addStage({
      stageName: "Pipeline_Update",
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "Pipeline_Update",
          stackName: "PipelineStack",
          templatePath: this.cdkBuildOutput.atPath("PipelineStack.template.json"),
          adminPermissions: true,
        }),
      ],
    });
   

  }
  // public addServiceStage(
  //   serviceStack: ServiceStack,
  //   stageName: string
  // ): IStage {
  //   return this.pipeline.addStage({
  //     stageName: stageName,
  //     actions: [
  //       new CloudFormationCreateUpdateStackAction({
  //         actionName: "Service_Update",
  //         stackName: serviceStack.stackName,
  //         templatePath: this.cdkBuildOutput.atPath(
  //           `${serviceStack.stackName}.template.json`
  //         ),
  //         adminPermissions: true,
  //         parameterOverrides: {
  //           ...serviceStack.serviceCode.assign(
  //             this.serviceBuildOutput.s3Location
  //           ),
  //         },
  //         extraInputs: [this.serviceBuildOutput],
  //       }),
  //     ],
  //   });
  // }
  public addServiceStage(
    serviceStack: ServiceStack,
    stageName: string
  ): IStage {
    return this.pipeline.addStage({
      stageName: stageName,
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: "Service_Update",
          stackName: serviceStack.stackName,
          templatePath: this.cdkBuildOutput.atPath(
            `${serviceStack.stackName}.template.json`
          ),
          adminPermissions: true,
          parameterOverrides: {
            ...serviceStack.serviceCode.assign(
              this.serviceBuildOutput.s3Location
            ),
          },
          extraInputs: [this.serviceBuildOutput],
        }),
      ],
    });
  }
  // public addServiceIntegrationTestToStage(
  //   stage: IStage,
  //   serviceEndpoint: string
  // ) {
  //   stage.addAction(
  //     new CodeBuildAction({
  //       actionName: "Integration_Tests",
  //       input: this.serviceSourceOutput,
  //       project: new PipelineProject(this, "ServiceIntegrationTestsProject", {
  //         environment: {
  //           buildImage: LinuxBuildImage.STANDARD_5_0,
  //         },
  //         buildSpec: BuildSpec.fromSourceFilename(
  //           "build-specs/integ-test-build-spec.yml"
  //         ),
  //       }),
  //       environmentVariables: {
  //         SERVICE_ENDPOINT: {
  //           value: serviceEndpoint,
  //           type: BuildEnvironmentVariableType.PLAINTEXT,
  //         },
  //       },
  //       type: CodeBuildActionType.TEST,
  //       runOrder: 2,
  //     })
  //   );
  // }
  public addServiceIntegrationTestToStage(
    stage: IStage,
    serviceEndpoint: string
  ) {
    const integTestAction = new CodeBuildAction({
      actionName: "Integration_Tests",
      input: this.serviceSourceOutput,
      project: new PipelineProject(this, "ServiceIntegrationTestsProject", {
        environment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: BuildSpec.fromSourceFilename(
          "build-specs/integ-test-build-spec.yml"
        ),
      }),
      environmentVariables: {
        SERVICE_ENDPOINT: {
          value: serviceEndpoint,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
      },
      type: CodeBuildActionType.TEST,
      runOrder: 2,
    });
    stage.addAction(integTestAction);
    integTestAction.onStateChange(
      "IntegrationTestFailed",
      new SnsTopic(this.pipelineNotificationsTopic, {
        message: RuleTargetInput.fromText(
          `Integration Test Failed. See details here: ${EventField.fromPath(
            "$.detail.execution-result.external-execution-url"
          )}`
        ),
      }),
      {
        ruleName: "IntegrationTestFailed",
        eventPattern: {
          detail: {
            state: ["FAILED"],
          },
        },
        description: "Integration test has failed",
      }
    );
  }

}