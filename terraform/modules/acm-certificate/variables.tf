variable "certificate_name" {
  description = "Name for the SSL certificate"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the certificate (e.g., weather.mattlittle.me)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for DNS validation"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
