import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

const docClient = new AWS.DynamoDB.DocumentClient()
const documentsTable = process.env.DOCUMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const documentId = event.pathParameters.documentId;
    const validDocumentId = await documentExists(documentId);

    if (!validDocumentId) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({
                error: 'Document does not exist'
            })
        }
    }

    const document = await deleteDocument(documentId);
    
    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify({
            document
        })
    }
}

const documentExists = async (documentId: string) => {
    const result = await docClient.get({
        TableName: documentsTable,
        Key: {
            id: documentId
        }
    }).promise()

    return !!result.Item
}

const deleteDocument = async (documentId: string) => {
    const documents = await docClient.delete({
        TableName: documentsTable,
        Key: {
            id: documentId
        } 
    }).promise()

    return documents.Attributes;
}