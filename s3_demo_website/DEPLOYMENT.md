# 🚀 Deployment Guide - Crypto Juice Exchange

## Prerequisites Check

Before deploying, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Terraform installed (`terraform --version`)
- ✅ AWS CLI configured (`aws configure`)
- ✅ AWS credentials with S3 permissions

## Step-by-Step Deployment

### Step 1: Build the React Application

```bash
cd s3_demo_website
npm install
npm run build
cd ..
```

**What happens:**
- Installs all dependencies
- Compiles TypeScript to JavaScript
- Bundles with Vite
- Optimizes assets
- Creates `dist/` folder with production build

**Expected output:**
```
✓ 2962 modules transformed.
dist/index.html                   0.61 kB
dist/assets/index-B4hzwHLp.css   16.18 kB
dist/assets/index-BQvRYxXo.js   801.98 kB
✓ built in 2.59s
```

### Step 2: Initialize Terraform

```bash
terraform init
```

**What happens:**
- Downloads AWS provider plugin
- Sets up backend
- Prepares working directory

**Expected output:**
```
Initializing the backend...
Initializing provider plugins...
- Finding latest version of hashicorp/aws...
- Installing hashicorp/aws...
Terraform has been successfully initialized!
```

### Step 3: Preview Changes

```bash
terraform plan
```

**What happens:**
- Shows what resources will be created
- Calculates file uploads
- Displays execution plan

**Expected resources:**
- `aws_s3_bucket.website` - The S3 bucket
- `aws_s3_bucket_website_configuration.website` - Website hosting config
- `aws_s3_bucket_public_access_block.website` - Public access settings
- `aws_s3_bucket_policy.website` - IAM policy for public read
- `aws_s3_object.website_files[...]` - 4 files to upload

### Step 4: Deploy to AWS

```bash
terraform apply
```

Type `yes` when prompted.

**What happens:**
1. Creates S3 bucket
2. Configures website hosting
3. Sets up public access
4. Applies bucket policy
5. Uploads all files from `dist/`

**Expected output:**
```
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.

Outputs:

bucket_name = "glenn-sin-web-buckett"
files_uploaded = 4
s3_website_url = "http://glenn-sin-web-buckett.s3-website.eu-west-1.amazonaws.com"
```

### Step 5: Access Your Site

Copy the `s3_website_url` from the output and open it in your browser!

## Updating the Site

### 1. Make changes to React code

Edit any files in `s3_demo_website/src/`

### 2. Rebuild

```bash
cd s3_demo_website
npm run build
cd ..
```

### 3. Redeploy

```bash
terraform apply
```

Terraform will detect changed files and update only what's necessary!

## Troubleshooting

### "Bucket already exists"

If you get a bucket name conflict:

1. Edit `main.tf` line 9
2. Change `website_bucket_name` to something unique
3. Run `terraform apply` again

### "AccessDenied" during bucket policy creation

This is a timing issue. Simply run:

```bash
terraform apply
```

AWS needs a moment between creating the bucket and applying the policy.

### Build fails with npm errors

```bash
cd s3_demo_website
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site shows 404

Check that:
1. Build succeeded (`dist/index.html` exists)
2. Terraform uploaded files (check output shows `files_uploaded = 4`)
3. You're using the URL from `terraform output s3_website_url`

### Styles not loading

This usually means MIME types aren't set correctly. The Terraform config handles this automatically with the `content_type` attribute.

Verify by checking one of the CSS files in S3 console - it should show `Content-Type: text/css`

### APIs not returning data

The site uses public APIs that don't require keys, but they do have rate limits:

- **CoinGecko**: 10-30 calls/minute
- **CryptoCompare**: 100,000 calls/month

If you're hitting limits, you'll see error messages in the browser console. Wait a few minutes and refresh.

## Destroying Resources

To remove everything from AWS:

```bash
terraform destroy
```

Type `yes` when prompted.

**What happens:**
- Deletes all S3 objects
- Removes bucket policy
- Deletes S3 bucket
- Removes all Terraform-managed resources

## Cost Breakdown

Typical monthly costs for this setup:

```
S3 Storage (1 GB):           $0.023
S3 Requests (10,000):        $0.005
Data Transfer (1 GB):        $0.09
-------------------------
Total:                       ~$0.12/month
```

With typical demo usage: **< $0.01/month**

## Advanced: Add Custom Domain

### 1. Register domain in Route53 (or use existing)

### 2. Add CloudFront distribution

```hcl
resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.website.website_endpoint
    origin_id   = "S3-Website"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Website"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 3. Point domain to CloudFront

Add Route53 record pointing to CloudFront distribution.

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build React app
        run: |
          cd s3_demo_website
          npm install
          npm run build

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Terraform Init
        run: terraform init

      - name: Terraform Apply
        run: terraform apply -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Add AWS credentials to GitHub repo secrets!

## Monitoring

### View access logs

Enable S3 logging in Terraform:

```hcl
resource "aws_s3_bucket_logging" "website" {
  bucket = aws_s3_bucket.website.id

  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "access-logs/"
}
```

### CloudWatch metrics

Monitor via AWS Console → CloudWatch:
- Request count
- Data transfer
- Error rates

## Security Best Practices

### 1. Don't commit AWS credentials
Add to `.gitignore`:
```
*.tfvars
.terraform/
terraform.tfstate*
.env
```

### 2. Use IAM roles for CI/CD
Instead of access keys in GitHub secrets, use OIDC with GitHub Actions.

### 3. Enable versioning
```hcl
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

### 4. Add WAF protection (for production)
CloudFront + AWS WAF can protect against DDoS and common attacks.

## Performance Tips

### 1. Enable CloudFront caching
Speeds up global access and reduces S3 costs.

### 2. Optimize images
Use WebP format and responsive images.

### 3. Code splitting
Vite automatically does this, but you can improve it further:
```typescript
const Component = lazy(() => import('./Component'));
```

### 4. Service Worker
Add offline support with Workbox.

## Support

If you run into issues:

1. Check Terraform output for errors
2. Verify AWS credentials are configured
3. Check the browser console for API errors
4. Ensure build succeeded (dist/ folder exists)
5. Verify bucket policy allows public read

---

**Happy deploying!** 🚀
