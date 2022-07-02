require('dotenv').config()
const AWS = require('aws-sdk');

const config = {
  region: process.env.SM_AWS_REGION,
  accessKeyId: process.env.SM_ACCESS_KEY_ID,
  secretAccessKey: process.env.SM_SECRET_ACCESS_KEY,
  VersionId: process.env.SM_VERSION_ID,
}
const params = { SecretId: process.env.SM_SECRET_ID };

const secretsmanager = new AWS.SecretsManager(config);

async function aws_sm_payload(){
  const aws_sm = await secretsmanager.getSecretValue(params).promise();
  const sm = JSON.parse(aws_sm.SecretString)
  return sm
}



module.exports = {aws_sm_payload:aws_sm_payload}