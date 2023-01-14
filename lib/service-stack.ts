// import { Stack, StackProps } from "aws-cdk-lib"
// import { HttpIntegration } from "aws-cdk-lib/aws-apigateway";
// import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
// // import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
// import { Construct } from "constructs"
//  import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
// import { Lambda } from "aws-cdk-lib/aws-ses-actions";

// export class ServiceStack extends Stack {
//     public readonly serviceCode: Code;
//     constructor(scope: Construct, id: string, props?: StackProps) {
//         super(scope, id, props)
//         this.serviceCode = Code.fromCfnParameters();
//         const lambda = new Function(this, "serviceLambda", {
//             runtime: Runtime.NODEJS_16_X,
//             handler: "src/lambda.handler",
//             code: this.serviceCode,
//             functionName: "ServiceLambda",
//         })
//         //version 1.99 
//         // new HttpApi(this, "ServiceAPI", {
//         //     defaultIntegration: new LambdaProxyIntegration({
//         //       handler: lambda,
//         //     }),
//         //     apiName: "MyService",
//         //   });
//         // new HttpApi(this, "ServiceApi", {
//         //     defaultIntegration: new HttpLambdaIntegration("LambdaIntegration", lambda),
//         //     apiName: "MyService",
//         // })

//     }
// }
import { Stack, StackProps } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from "constructs"
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";


export class ServiceStack extends Stack {
    public readonly serviceCode: Code;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)
        this.serviceCode = Code.fromCfnParameters();
        const lambda=new Function(this, "serviceLambda", {
            runtime: Runtime.NODEJS_16_X,
            handler: "src/lambda.handler",
            code: this.serviceCode,
            functionName: "ServiceLambda",
        })
        // new HttpApi(this, "ServiceAPI", {
        //     defaultIntegration: new LambdaProxyIntegration({
        //       handler: lambda,
        //     }),
        //     apiName: "MyService",
        //   });
        new HttpApi(this,"ServiceApi",{
            defaultIntegration:new HttpLambdaIntegration("LambdaIntegration",lambda),
            apiName: "MyService"
        })
    }
    
}