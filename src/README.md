# KubeWatch
KubeWatch is (will be) a monitoring application for Kubernetes.
It will keep track of multiple K8S nodes, records performance data and visualize it.
Furthermore, it should send some kind of notification to the responsible people.

## Road map
- [ ] Monitor K8S nodes
- [ ] Collect data from nodes
- [ ] Visualize the data somehow
- [ ] Send notification
- [ ] Run an analysis on the aggregated data
- [ ] Visualize the K8S pods and nodes in a graph

## Time Tracking Setup
Requirements:  NodeJS, npm, python3
1. Open terminal
2. cd ~
3. npm install gitlab-time-tracker
4. Add ~/node_modules/.bin/ to PATH
5. Generate a [personal access token](https://gitlab.ost.ch/-/profile/personal_access_tokens) with the `api` scope selected. Make sure to save it somewhere, it will only be displayed once.
6. Run `gtt config` and enter the following information:
```
url: https://gitlab.ost.ch/api/v4/
token: <insert your personal access token here>
```
7. Navigate to the `/Documentation` directory
8. make time_tracking_report
9. Navigate to `/Documentation/time_tracking`, here you can find the `report.pdf`

## Development Setup
Requirements: WebStorm, NodeJS and npm
1. Clone repo
2. Open project with Webstorm
3. Run npm install
4. Run KubeWatch with existing run configuration

## Installation for K8s
### Setup
#### Docker
https://docs.docker.com/get-docker/

#### kubectl
https://kubernetes.io/docs/tasks/tools/#kubectl

#### Minikube
https://minikube.sigs.k8s.io/docs/start/
On linux `uname -a` to request your architecture ;)

#### Cloud Code
https://plugins.jetbrains.com/plugin/8079-cloud-code/

### Useful commands
| Command | Description |
|---|---|
| minikube start | creates/starts kubernetes cluster |
| minikube stop | stops running kubernetes cluster |
| minikube pause/unpause | pause/unpause kubernetes cluster |
| docker system prune | delete all not currently used docker resources |
| kubectl get all (-A) | show all kubernetes resources in default namespace (-A=all-namespaces) |
| kubectl get nodes | show all kubernetes nodes (not shown in get all) |

## Start web application with local Kubernetes cluster
1. First time before you can start the web application with the local K8s cluster enter the following commands in your shell:
```
systemctl enable docker.service
systemctl start docker.service
minikube start
```
> It might be necessary to add your user to the docker group: `sudo usermod -aG docker $USER && newgrp docker` and restart your computer afterwards.
2. Always before you can start the web application with the local K8s cluster enter the following command in your shell:
```
minikube start
```
This command set the context for your web application.
3. Choose the Running Configuration with the name "KubeWatch local K8s cluster" (with the Cloud Code Symbol)
4. Run you application :)
5. After development stop the K8s cluster
```
minikube stop
```
## Installation Guide SonarQube

### SonarQube
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
1. Download the \textit{SonarScanner} zip for your system from the following source: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extract the \textit{SonarScanner} zip
3. Add the bin folder in the extracted folder to the path variable (the location from the SonnarScanner folder doesn't matter).
4. Change in the sonarscanner/conf folder the sonar-project.properties file with the following lines:
```
#----- Local
sonar.host.url=http://localhost:9000
sonar.login=<your-sonar-qube-token>
```
5. Start \textit{SonarScanner} (scan) with the command:
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