import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class GitPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "AwesomePipeline", {
      pipelineName: "AwesomePipeline",
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
  }
}
