# AWS Configuration
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# Domain Configuration
variable "domain_name" {
  description = "Full domain name for the site (e.g., weather.mattlittle.me)"
  type        = string
  default     = "weather.mattlittle.me"
}

variable "subdomain" {
  description = "Subdomain name (e.g., weather)"
  type        = string
  default     = "weather"
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for mattlittle.me"
  type        = string
  default     = "Z32TZDXWWXB3BW"
}

# S3 Configuration
variable "bucket_name" {
  description = "Name of the S3 bucket for static site"
  type        = string
  default     = "weather-mattlittle-me"
}

variable "enable_versioning" {
  description = "Enable versioning for the S3 bucket"
  type        = bool
  default     = true
}

# CloudFront Configuration
variable "distribution_name" {
  description = "Name for the CloudFront distribution"
  type        = string
  default     = "little-weather-prod"
}

variable "cloudfront_price_class" {
  description = "CloudFront distribution price class"
  type        = string
  default     = "PriceClass_100"
}

variable "enable_ipv6" {
  description = "Enable IPv6 for CloudFront"
  type        = bool
  default     = false
}

# SSL Certificate
variable "certificate_name" {
  description = "Name for the SSL certificate"
  type        = string
  default     = "weather-mattlittle-me-cert"
}

# Tags
variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "little-weather"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
