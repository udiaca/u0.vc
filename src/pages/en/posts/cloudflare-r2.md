---
layout: ../../../layouts/MarkdownLayout.astro
title: "Cloudflare R2"
---

[Cloudflare R2 documentation](https://developers.cloudflare.com/r2)

# Configure CORS for your bucket

> Currently, you have to use the S3 API `PutBucketCors` to configure CORS for your bucket.

[Existing documentation](https://developers.cloudflare.com/r2/data-access/public-buckets/#configure-cors-for-your-bucket)

## S3 API

[S3 API Compatibility](https://developers.cloudflare.com/r2/data-access/s3-api/api/)

Let's initialize some variables for our API requests.

```bash
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ACCOUNT_ID="d10b3c92205db41a51548f5ad4e33ffe"
API_TOKEN="your-api-token"
API_TOKEN="vZCUoBmp7nOqnUWwLm7uRD-CHz1H1JDpFIectU_6"
```

### Attempt with CURL

**put_bucket_cors_req.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
   <CORSRule>
      <AllowedMethod>GET</AllowedMethod>
      <AllowedHeader>*</AllowedHeader>
      <AllowedOrigin>*</AllowedOrigin>
      <MaxAgeSeconds>3000</MaxAgeSeconds>
   </CORSRule>
</CORSConfiguration>
```

```bash
SHA_256_SUM=$(cat put_bucket_cors_req.xml | shasum -a 256 | awk '{print $1}')
NOW_ISO=$(TZ=UTC date +"%Y%m%dT%H%M%S%z")
curl --verbose \
     -X PUT "https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/?cors" \
     -H "Authorization: Bearer ${API_TOKEN}" \
     -H "Content-Type: txt/xml" \
     -H "x-amz-content-sha256: ${SHA_256_SUM}" \
     -H "x-amz-date: ${NOW_ISO}" \
     -d @put_bucket_cors_req.xml
```
```xml
<?xml version="1.0" encoding="UTF-8"?><Error><Code>InvalidRequest</Code><Message>Please use AWS4-HMAC-SHA256</Message></Error>
```

This is not working, let's try using the official AWS CLI.

### Using AWS CLI

[Installing or updating the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

[Generate an S3 Authentication Auth token](https://developers.cloudflare.com/r2/data-access/s3-api/tokens/), creating an access key ID and a secret.

```
ACCESS_KEY_ID=your-r2-access-key-id
SECRET_ACCESS_KEY=your-r2-secret-access-key
```

[Configure `aws` CLI for R2](https://developers.cloudflare.com/r2/examples/aws-cli/), ensure that you can list your buckets.

```bash
aws --version
# aws-cli/2.9.9 Python/3.9.11 Darwin/21.6.0 exe/x86_64 prompt/off
aws s3api list-buckets --endpoint-url "https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"
```

Allow GET requests **put_bucket_cors_req.json**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["Authorization"],
      "AllowedMethods": ["GET"],
      "MaxAgeSeconds": 3000,
    }
  ]
}
```

```bash
aws s3api put-bucket-cors \
  --bucket u0-vc \
  --endpoint-url "https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --cors-configuration file://put_bucket_cors_req.json
```
