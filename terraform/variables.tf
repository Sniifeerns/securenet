variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed for SSH access"
  type        = string
}

variable "ssh_public_key" {
  description = "Public SSH key for EC2 access"
  type        = string
}

variable "new_relic_secret_name" {
  description = "Secrets Manager secret name for New Relic credentials"
  type        = string
  default     = "securenet/newrelic"
}

variable "new_relic_license_key" {
  description = "New Relic license key for infrastructure agent"
  type        = string
  sensitive   = true
}

variable "new_relic_account_id" {
  description = "New Relic account ID"
  type        = string
  sensitive   = true
}

variable "new_relic_api_key" {
  description = "New Relic API key for NerdGraph"
  type        = string
  sensitive   = true
}

variable "new_relic_region" {
  description = "New Relic region"
  type        = string
  default     = "EU"
}

variable "metrics_lookback_minutes" {
  description = "Metrics lookback window in minutes"
  type        = number
  default     = 30
}
