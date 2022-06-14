# KubeWatch
[![pipeline status](https://github.com/KubeWatch-Monitoring/KubeWatch/actions/workflows/node.js.yml/badge.svg)](https://github.com/KubeWatch-Monitoring/KubeWatch/actions/workflows/node.js.yml)

KubeWatch is a web application that can be used to monitor and visualize a Kubernetes cluster.
Additionally, notifications are triggered if a pod goes down, which are displayed on the website
and delivered to the right people via email or SMS.
This allows an optimal usage for Kubernetes cluster administrators.
KubeWatch is targeted to technical users who have some experience with Kubernetes.
However, even non-technical users can find their way around our application
and be able to use it easily.

**Authors:**
- Benjamin Plattner
- Jan Untersander
- Olivier Lischer
- Pascal Lehmann
- Petra Heeb


## Directories
- src: this folder contains the entire application
- Documentation: this folder contains the documentation
- Organisation: this folder contains files to help us with our work

## Deploying KubeWatch in your own Kubernetes cluster

Prerequisites:

- Access to a running Kubernetes cluster via `kubectl`
- Access to this Gitlab container registry
### Quick setup

Run the following commands:
```bash
https://github.com/KubeWatch-Monitoring/KubeWatch.git
cd KubeWatch
kubectl apply -f src/kubernetes-manifests/Database
kubectl apply -f src/kubernetes-manifests/prometheus
kubectl apply -f deployment/kubernetes-manifests
```

## Development Setup
Requirements: WebStorm, NodeJS and npm
1. Clone repo
2. Open project with Webstorm
3. Run npm install


## Minikube Setup
1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
3. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/)
    - Hint: Use `uname -a` on Linux to find your architecture ;)
4. Install the WebStorm [Cloud Code Plugin](https://plugins.jetbrains.com/plugin/8079-cloud-code/)

### Useful commands
| Command | Description |
|---|---|
| minikube start | creates/starts kubernetes cluster |
| minikube stop | stops running kubernetes cluster |
| minikube pause/unpause | pause/unpause kubernetes cluster |
| docker system prune | delete all not currently used docker resources |
| kubectl get all (-A) | show all kubernetes resources in default namespace (-A=all-namespaces) |
| kubectl get nodes | show all kubernetes nodes (not shown in get all) |


## Launching the application locally
1. Before launching the application locally enter the following commands in your shell:
```
systemctl start docker.service
minikube start
```
> It might be necessary to add your user to the docker group: `sudo usermod -aG docker $USER && newgrp docker` and restart your computer afterwards.
2. Start the application with the desired Web Storm running configuration
3. After development, make sure to stop Minikube and Docker
```
minikube stop
systemctl stop docker.service
```


## SonarQube Setup
1. To install the *SonarQube* instance use the following docker command in you console:
```
docker run -d --name sonarqube -e
    SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000
    sonarqube:latest
```
2. If the instance is running, you can login to http://localhost:9000 and use the default credentials. After the first login you need to change them.
```
login: admin
password: admin
```
3. Create a new project with the name *KubeWatch*
4. Go to the *KubeWatch* Project and choose local analysation.
5. Generate a token (only first time) and safe this token somewhere you'll find it again (need it in the *SonarScanner* section again).
6. Choose continue and then choose other and your OS.

### SonarScanner
1. Download the *SonarScanner* zip for your system from the following source: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extract the *SonarScanner* zip
3. Add the bin folder in the extracted folder to the path variable (the location from the SonnarScanner folder doesn't matter).
4. Change in the sonarscanner/conf folder the sonar-project.properties file with the following lines:
```
#----- Local
sonar.host.url=http://localhost:9000
sonar.login=<your-sonar-qube-token>
```
5. Start *SonarScanner* (scan) with the command:
```
sh /<dir-path-to-sonnar-scanner-folder>/bin/sonar-scanner
```
(no error should be there)

6. After the scan is finished, there will be a link to the actual report of the scan in the console output.
7. If everything works fine you'll get an scan overview like this: \newline
   ![Scan]{../Documentation/src/resources/scan.png}

### Useful/Needed Docker Commands
#### Stop Docker Container
After using *SonarQube* stop the local server with the following command
```
docker stop sonarqube
```

#### Restart Docker Container
To use the server again use the following command to restart the docker container:
```
docker restart sonarqube
```
