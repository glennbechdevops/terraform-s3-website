module "s3_website" {
  source = "./modules/s3-website"

  # Send begge providers til modulen
  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  bucket_name = var.bucket_name
  subdomain   = "ilyas" # Endre til ditt unike navn (f.eks. "glenn")

  tags = {
    Name         = "My Website"
    Environment  = "Demo"
    PipelineTest = "true"
  }
}

output "s3_website_url" {
  value       = module.s3_website.website_url
  description = "URL for the S3 hosted website"
}

output "bucket_name" {
  value       = module.s3_website.bucket_name
  description = "Name of the S3 bucket"
}

output "cloudfront_url" {
  value       = module.s3_website.cloudfront_url
  description = "CloudFront URL with HTTPS"
}

output "custom_domain_url" {
  value       = module.s3_website.custom_domain_url
  description = "Custom domain URL with HTTPS"
}
