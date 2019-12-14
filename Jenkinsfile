pipeline {
    agent any

    stages {
        stage('Build and Test') {
            parallel {
                stage('Build') {
                    steps {
                        sh 'yarn build'
                    }
                }
                stage('Test') {
                    steps {
                        sh "yarn test"
                    }
                }
                stage('Deploy') {
                    steps {
                        sh "yarn test"
                    }
                }

            }
        }
    }
}