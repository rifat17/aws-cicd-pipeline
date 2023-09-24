import * as cdk from 'aws-cdk-lib';
import { LinuxBuildImage, BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';

export class GitPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "AwesomePipeline", {
      pipelineName: "AwesomePipeline",
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.AMAZON_LINUX_2_5,
        },
        partialBuildSpec: BuildSpec.fromObject({
          version: 0.2,
          phases: {
            install : {
              'runtime-version': {
                nodejs: 18
              }
            }
          }
        })
      },
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("rifat17/aws-cicd-pipeline", "main", {
          authentication: cdk.SecretValue.secretsManager('github-token')
        }),
        commands: [
          // "cd git-pipeline",
          "npm ci",
          "npx cdk synth",
        ]
      })
    })

    const testStage = pipeline.addStage(new PipelineStage(this, "PipelineTestStage", {
      stageName: "test"
    }))
    testStage.addPre(new CodeBuildStep("unit-test", {
      commands: [
        "npm ci",
        "npm run test"
      ]
    }))
  }


}
