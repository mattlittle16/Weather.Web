# Route53 A record (alias) pointing to CloudFront distribution
resource "aws_route53_record" "site" {
  zone_id = var.hosted_zone_id
  name    = var.subdomain
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}
