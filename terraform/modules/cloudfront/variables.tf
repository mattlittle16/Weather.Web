variable "distribution_name" {
  description = "Name for the CloudFront distribution"
  type        = string
}

variable "distribution_comment" {
  description = "Comment for the CloudFront distribution"
  type        = string
  default     = "CloudFront distribution for static site"
}

variable "domain_name" {
  description = "Custom domain name for the distribution"
  type        = string
}

variable "s3_bucket_id" {
  description = "ID of the S3 bucket"
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS"
  type        = string
}

variable "price_class" {
  description = "CloudFront distribution price class"
  type        = string
  default     = "PriceClass_100"
}

variable "enable_ipv6" {
  description = "Enable IPv6 for the distribution"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
