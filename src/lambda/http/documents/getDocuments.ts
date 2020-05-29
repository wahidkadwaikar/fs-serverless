import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

const docClient = new AWS.DynamoDB.DocumentClient()

const documentsTable = process.env.DOCUMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    const result = await docClient.scan({
        TableName: documentsTable
    }).promise()

    const items = result.Items;

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify({
            items
        })
    }
}