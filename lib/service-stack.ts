import { Stack, StackProps } from "aws-cdk-lib"
import { CfnParametersCode, Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from "constructs"
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";

interface ServiceStackProps extends StackProps {
    stageName: string;
}
export class ServiceStack extends Stack {

    public readonly serviceCode: CfnParametersCode;
    constructor(scope: Construct, id: string, props:ServiceStackProps) {
        super(scope, id, props)
        this.serviceCode = Code.fromCfnParameters();
        const lambda = new Function(this, "serviceLambda", {
            runtime: Runtime.NODEJS_16_X,
            handler: "src/lambda.handler",
            code: this.serviceCode,
            functionName: `ServiceLambda${props.stageName}`,
        })
        new HttpApi(this, "ServiceApi", {
            defaultIntegration: new HttpLambdaIntegration("LambdaIntegration", lambda),
            apiName: `MyService${props.stageName}`
        })
    }

}