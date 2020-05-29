import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import * as uuid from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient()

const documentsTable = process.env.DOCUMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    const itemId = uuid.v4();

    const parsedBody = JSON.parse(event.body)

    const newItem = {
        id: itemId,
        ...parsedBody
    }

    await docClient.put({
        TableName: documentsTable,
        Item: newItem
    }).promise()

    return {
        statusCode: 201,
        headers:{
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem
        })
    }
}