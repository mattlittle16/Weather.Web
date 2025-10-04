terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Local state configuration (no remote backend)
}

# Primary provider - us-east-1 required for ACM certificate with CloudFront
provider "aws" {
  region = var.aws_region
}

# ACM Certificate (must be created first, in us-east-1)
module "acm_certificate" {
  source = "./modules/acm-certificate"

  certificate_name = var.certificate_name
  domain_name      = var.domain_name
  hosted_zone_id   = var.hosted_zone_id

  tags = var.tags
}

# CloudFront Distribution
module "cloudfront" {
  source = "./modules/cloudfront"

  distribution_name                = var.distribution_name
  distribution_comment             = "CloudFront distribution for ${var.domain_name}"
  domain_name                      = var.domain_name
  s3_bucket_id                     = module.s3_static_site.bucket_id
  s3_bucket_regional_domain_name   = module.s3_static_site.bucket_regional_domain_name
  acm_certificate_arn              = module.acm_certificate.certificate_arn
  price_class                      = var.cloudfront_price_class
  enable_ipv6                      = var.enable_ipv6

  tags = var.tags

  depends_on = [module.acm_certificate, module.s3_static_site]
}

# S3 Static Site Bucket
module "s3_static_site" {
  source = "./modules/s3-static-site"

  bucket_name       = var.bucket_name
  enable_versioning = var.enable_versioning

  tags = var.tags
}

# S3 Bucket Policy - Created after CloudFront to avoid circular dependency
resource "aws_s3_bucket_policy" "static_site" {
  bucket = module.s3_static_site.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAC"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_static_site.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [module.cloudfront, module.s3_static_site]
}

# DNS Record pointing to CloudFront
module "dns" {
  source = "./modules/dns"

  hosted_zone_id             = var.hosted_zone_id
  subdomain                  = var.subdomain
  cloudfront_domain_name     = module.cloudfront.distribution_domain_name
  cloudfront_hosted_zone_id  = module.cloudfront.distribution_hosted_zone_id

  tags = var.tags

  depends_on = [module.cloudfront]
}
