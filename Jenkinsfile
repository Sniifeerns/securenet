pipeline {
    agent any
    
    environment {
        // ⚠️ CAMBIA ESTO por tu ID de cuenta de AWS y Región
        AWS_REGION = 'eu-west-3'
        AWS_ACCOUNT_ID = '812752207341' // <-- Tu ID de cuenta personal
        
        // Estas son las URLs de los repositorios que creaste con Terraform
        ECR_API = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-api"
        ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-frontend"
        ECR_GATEWAY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-gateway"
        
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Login en AWS ECR') {
            steps {
                // Jenkins usa su Rol IAM para conseguir la contraseña temporal de ECR
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_API%/*}
                '''
            }
        }
        
        stage('Build y Push a ECR') {
            parallel {
                stage('API') {
                    steps {
                        sh '''
                            docker build -t ${ECR_API}:${IMAGE_TAG} -f docker/api/Dockerfile .
                            docker tag ${ECR_API}:${IMAGE_TAG} ${ECR_API}:latest
                            docker push ${ECR_API}:${IMAGE_TAG}
                            docker push ${ECR_API}:latest
                        '''
                    }
                }
                stage('Frontend') {
                    steps {
                        sh '''
                            docker build --build-arg VITE_METRICS_API=/api -t ${ECR_FRONTEND}:${IMAGE_TAG} -f docker/frontend/Dockerfile .
                            docker tag ${ECR_FRONTEND}:${IMAGE_TAG} ${ECR_FRONTEND}:latest
                            docker push ${ECR_FRONTEND}:${IMAGE_TAG}
                            docker push ${ECR_FRONTEND}:latest
                        '''
                    }
                }
                stage('Gateway') {
                    steps {
                        sh '''
                            docker build -t ${ECR_GATEWAY}:${IMAGE_TAG} -f docker/gateway/Dockerfile .
                            docker tag ${ECR_GATEWAY}:${IMAGE_TAG} ${ECR_GATEWAY}:latest
                            docker push ${ECR_GATEWAY}:${IMAGE_TAG}
                            docker push ${ECR_GATEWAY}:latest
                        '''
                    }
                }
            }
        }
        
        stage('Despliegue seguro en App EC2') {
            steps {
                // Jenkins no maneja claves de New Relic: la App EC2 las obtiene desde Secrets Manager
                sshagent(credentials: ['id_jenkins']) {
                    sh '''
                        # Buscamos la IP privada de la maquina de Docker
                        APP_IP=$(aws ec2 describe-instances \
                            --region ${AWS_REGION} \
                            --filters "Name=tag:Name,Values=docker-aws" "Name=instance-state-name,Values=running" \
                            --query "Reservations[0].Instances[0].PrivateIpAddress" \
                            --output text)
                        
                        echo "Desplegando en la máquina App con IP interna: $APP_IP"
                        
                        # Copiamos el archivo de orquestación al servidor
                        scp -o StrictHostKeyChecking=no docker-compose.ecr.yml ec2-user@${APP_IP}:/opt/app/docker-compose.yml
                        
                        # Nos conectamos por SSH para encender todo
                        ssh -o StrictHostKeyChecking=no ec2-user@${APP_IP} "
                            cd /opt/app
                            
                            # Sincroniza secretos y configura New Relic host-agent
                            sudo /usr/local/bin/securenet-sync-newrelic.sh
                            
                            # AWS Login en la máquina destino
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_API%/*}
                            
                            # Descargamos las imágenes nuevas y levantamos la App
                            docker compose pull
                            docker compose up -d --remove-orphans
                        "
                    '''
                }
            }
        }
    }
}