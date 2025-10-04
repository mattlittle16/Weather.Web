variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for the parent domain"
  type        = string
}

variable "subdomain" {
  description = "Subdomain to create (e.g., weather)"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  type        = string
}

variable "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID of the CloudFront distribution"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
