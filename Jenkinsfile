pipeline {
    agent {
        docker {
            image 'node:9-alpine'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('dependency install') {
             steps {
                sh "npm install"
             }
        }
        stage('Build and Test') {
            parallel {
                stage('Build') {
                    steps {
                        sh 'node -v'
                        sh 'npm run build'
                    }
                }
                stage('Test') {
                    steps {
                        sh "npm run test"
                    }
                }
                stage('Deploy') {
                    steps {
                        sh "npm run test"
                    }
                }

            }
        }
    }
}