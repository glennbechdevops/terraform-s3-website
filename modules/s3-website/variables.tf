variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "subdomain" {
  description = "Subdomain for the website (e.g., 'glenn' becomes glenn.thecloudcollege.com)"
  type        = string
}