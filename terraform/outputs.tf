# S3 Bucket Outputs
output "s3_bucket_id" {
  description = "ID of the S3 bucket"
  value       = module.s3_static_site.bucket_id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = module.s3_static_site.bucket_arn
}

# ACM Certificate Outputs
output "certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = module.acm_certificate.certificate_arn
}

output "certificate_status" {
  description = "Status of the SSL certificate"
  value       = module.acm_certificate.certificate_status
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = module.cloudfront.distribution_arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.distribution_domain_name
}

# DNS Outputs
output "site_url" {
  description = "URL of the deployed site"
  value       = "https://${var.domain_name}"
}

output "dns_record_fqdn" {
  description = "Fully qualified domain name of the DNS record"
  value       = module.dns.record_fqdn
}

# Deployment Instructions
output "deployment_instructions" {
  description = "Instructions for deploying the React app"
  value = <<-EOT
    
    🎉 Infrastructure deployed successfully!
    
    📋 Next Steps:
    
    1. Build your React app:
       cd /Users/mattlittle/SourceControl/WeatherWeb
       npm run build
    
    2. Upload build files to S3:
       aws s3 sync dist/ s3://${var.bucket_name}/ --delete
    
    3. Invalidate CloudFront cache:
       aws cloudfront create-invalidation \
         --distribution-id ${module.cloudfront.distribution_id} \
         --paths "/*"
    
    4. Your site will be live at:
       🌐 https://${var.domain_name}
    
    Note: Certificate validation may take 5-10 minutes on first deployment.
  EOT
}
