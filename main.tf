# ============================================
# S3 Static Website Hosting with Terraform
# ============================================
# This configuration demonstrates Infrastructure as Code (IaC)
# for hosting a modern React application on AWS S3

# Local variables for configuration
locals {
  website_bucket_name = "glenn-sin-web-buckett"
  website_files_path  = "${path.module}/s3_demo_website/dist"

  # MIME type mappings for proper content serving
  mime_types = {
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
  }
}

# ============================================
# 1. S3 Bucket Creation
# ============================================
# Creates an S3 bucket to host our static website
# S3 provides durable, scalable object storage
resource "aws_s3_bucket" "website" {
  bucket = local.website_bucket_name

  tags = {
    Name        = "Crypto Juice Exchange Website"
    Environment = "Demo"
    ManagedBy   = "Terraform"
    Project     = "PGR301"
  }
}

# ============================================
# 2. Website Configuration
# ============================================
# Enables S3 static website hosting feature
# This allows S3 to serve HTML, CSS, and JS like a web server
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  # The default page to serve
  index_document {
    suffix = "index.html"
  }

  # For SPAs (Single Page Apps), we redirect all errors to index.html
  # This enables client-side routing (React Router, etc.)
  error_document {
    key = "index.html"
  }
}

# ============================================
# 3. Public Access Block Configuration
# ============================================
# By default, S3 blocks public access for security
# We need to disable this for public website hosting
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  # Allow public ACLs and policies
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# ============================================
# 4. Bucket Policy for Public Read Access
# ============================================
# IAM policy that allows anyone to read objects in the bucket
# This is required for public website hosting
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })

  # Ensure public access block is configured first
  depends_on = [aws_s3_bucket_public_access_block.website]
}

# ============================================
# 5. Upload Website Files
# ============================================
# Uploads all built files from the dist directory to S3
# This uses fileset() to iterate over all files
resource "aws_s3_object" "website_files" {
  for_each = fileset(local.website_files_path, "**/*")

  bucket = aws_s3_bucket.website.id
  key    = each.value
  source = "${local.website_files_path}/${each.value}"

  # Calculate MD5 hash for change detection
  # Terraform will only upload if file content changes
  etag = filemd5("${local.website_files_path}/${each.value}")

  # Set proper Content-Type for browser rendering
  content_type = lookup(
    local.mime_types,
    regex("\\.[^.]+$", each.value),
    "application/octet-stream"
  )

  # Enable browser caching for better performance
  cache_control = "public, max-age=3600"
}

# ============================================
# 6. Outputs
# ============================================
# These values are displayed after terraform apply
output "s3_website_url" {
  value       = "http://${aws_s3_bucket.website.bucket}.s3-website.${data.aws_region.current.name}.amazonaws.com"
  description = "URL for the S3 hosted website"
}

output "bucket_name" {
  value       = aws_s3_bucket.website.id
  description = "Name of the S3 bucket"
}

output "files_uploaded" {
  value       = length(aws_s3_object.website_files)
  description = "Number of files uploaded to S3"
}

# Data source to get current AWS region
data "aws_region" "current" {}
