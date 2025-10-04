output "record_name" {
  description = "Name of the DNS record"
  value       = aws_route53_record.site.name
}

output "record_fqdn" {
  description = "Fully qualified domain name of the DNS record"
  value       = aws_route53_record.site.fqdn
}
