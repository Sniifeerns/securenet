resource "aws_secretsmanager_secret" "securenet_newrelic" {
  name                    = var.new_relic_secret_name
  description             = "Secret JSON para credenciales de New Relic de SecureNet"
  recovery_window_in_days = 0

  tags = {
    Project     = "securenet"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_secretsmanager_secret_version" "securenet_newrelic_value" {
  secret_id = aws_secretsmanager_secret.securenet_newrelic.id

  secret_string = jsonencode({
    NEW_RELIC_LICENSE_KEY    = var.new_relic_license_key
    NEW_RELIC_ACCOUNT_ID     = var.new_relic_account_id
    NEW_RELIC_API_KEY        = var.new_relic_api_key
    NEW_RELIC_REGION         = var.new_relic_region
    METRICS_LOOKBACK_MINUTES = tostring(var.metrics_lookback_minutes)
  })
}

resource "aws_iam_policy" "securenet_newrelic_secrets_read" {
  name        = "securenet-newrelic-secrets-read"
  description = "Permite leer credenciales de New Relic desde AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowGetNewRelicSecret",
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        Resource = aws_secretsmanager_secret.securenet_newrelic.arn
      }
    ]
  })
}
