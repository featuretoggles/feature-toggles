pipeline {
    agent {
        docker {
        image 'node:6-alpine'
        args '-p 3000:3000'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('dependency install') {
            sh "npm install"
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