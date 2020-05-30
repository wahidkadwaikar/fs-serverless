import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from '../../../utils/logger';
const logger = createLogger('auth')

const docClient = new AWS.DynamoDB.DocumentClient()

const documentsTable = process.env.DOCUMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    /**
     * As a best practice, I could generate ID internally
     * instead of asking that as a body parameter
     * eg: const itemId = uuid.v4();
     */
    
    const parsedBody = JSON.parse(event.body)

    const newItem = {
        id: parsedBody.id,
        ...parsedBody
    }

    await docClient.put({
        TableName: documentsTable,
        Item: newItem
    }).promise()

    
    /**
     * Similar logging can be done throughout the application
     * to log important events
     */
    logger.info('Document was create', {
        key: newItem.id
      })

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