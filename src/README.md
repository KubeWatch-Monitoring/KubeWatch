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
