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
5. Generate a personal access token with the `api` scope here: https://gitlab.ost.ch/-/profile/personal_access_tokens. Make sure to save it somewhere, it will only be displayed once.
6. Run `gtt config` and enter the following information:
```
url: https://gitlab.ost.ch/api/v4/
token: <insert your personal access token here>
```
7. Navigate to the /Documentation directory
8. make time_tracking_report
9. Navigate to /Documentation/time_tracking, here you can find the `report.pdf`

## Development Setup
Requirements: WebStorm, NodeJS and npm
1. Clone repo
2. Open project with Webstorm
3. Run npm install
4. Run KubeWatch with existing run configuration
