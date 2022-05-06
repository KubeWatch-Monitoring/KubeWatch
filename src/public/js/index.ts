Chart.plugins.register(ChartDatasourcePrometheusPlugin);

const chartTemplate = "<div class='accordion-body'><div class='card'><div class='card-header'>" +
    "<h5>title</h5><button class='btn btn-primary btn-collapse'>Collapse</button>" +
    "</div><div class='card-body'><div class='collapsable'><div class='row'><canvas id='id'></canvas>" +
    "</div></div></div></div></div>";


// TODO: Remove all hard coded charts
const divContainer = document.querySelector("#chart-container");

const chartSetting = {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: 'http://127.0.0.1:9090',
          baseURL: '/api/v1',   // default value
        },
        query: '',
        timeRange: {
          type: 'relative',
          start: 0,
          end: 0,
          msUpdateInterval: 0,
        },
      },
    },
  },
};

const cpuElement = document.getElementById('cpuChart') as HTMLCanvasElement;
const ctxCpu = cpuElement.getContext('2d');
const cpuChart = new Chart(ctxCpu, {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: 'http://127.0.0.1:9090',
          baseURL: '/api/v1',   // default value
        },
        query: 'sum by (pod) (container_cpu_system_seconds_total{namespace!~"kube-system|monitoring|kubernetes-dashboard", pod!~""})',
        timeRange: {
          type: 'relative',

          // from 1 hours ago to now
          start: -1 * 60 * 60 * 1000,
          end: 0,
          msUpdateInterval: 5000,
        },
      },
    },
  },
});

const memoryElement = document.getElementById('memoryChart') as HTMLCanvasElement;
const ctxMemory = memoryElement.getContext('2d');

const memoryChart = new Chart(ctxMemory, {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: 'http://127.0.0.1:9090',
          baseURL: '/api/v1',   // default value
        },
        query: 'sum by (pod) (container_memory_usage_bytes{namespace!~"kube-system|monitoring|kubernetes-dashboard", pod!~""})',
        timeRange: {
          type: 'relative',

          // from 1 hours ago to now
          start: -1 * 60 * 60 * 1000,
          end: 0,
          msUpdateInterval: 5000,
        },
      },
    },
  },
});

const diskElement = document.getElementById('diskChart') as HTMLCanvasElement;
const ctxDisk = diskElement.getContext('2d');
const diskChart = new Chart(ctxDisk, {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    animation: {
      duration: 0,
    },
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: 'http://127.0.0.1:9090',
          baseURL: '/api/v1',   // default value
        },
        query: 'sum by (pod) (container_fs_usage_bytes{namespace!~"kube-system|monitoring|kubernetes-dashboard", pod!~""})',
        timeRange: {
          type: 'relative',

          // from 1 hours ago to now
          start: -1 * 60 * 60 * 1000,
          end: 0,
          msUpdateInterval: 5000,
        },
      },
    },
  },
});

document.querySelectorAll(".btn-collapse").forEach((e) => {
  e.addEventListener("click", () => {
    if (e.parentElement) {
      const view = e.parentElement.parentElement.querySelector<HTMLElement>(".collapsable");
      if (!view) {
        throw new ReferenceError("Could not find collapsable");
      }
      view.hidden = !view.hidden;
    }
  });
});

function cloneObject(obj: object): object {
  return JSON.parse(JSON.stringify(obj));
}

function createNewChartConfigFromSetting(chartSetting: object, setting: object) {
  const config = cloneObject(chartSetting);
  const prometheusConfig = config.options.plugins['datasource-prometheus'];
  prometheusConfig.query = setting.promql;
  prometheusConfig.timeRange.start = setting.start;
  prometheusConfig.timeRange.end = setting.end;
  prometheusConfig.timeRange.msUpdateInterval = setting.updateInterval;
  prometheusConfig.timeRange.type = 'relative';
  return config;
}

function createNewChartElement(chartSetting: object, id: string) {
  const el = document.createElement('div');
  el.innerHTML = chartTemplate;
  const canvas = el.firstElementChild.querySelector<HTMLCanvasElement>("#id");
  const h5 = el.firstElementChild.querySelector<HTMLHeadingElement>("h5");
  canvas.id = id;
  h5.innerText = id;
  return el.firstElementChild;
}

async function displayCharts() {
  const result = await fetch("http://127.0.0.1:8082/all");
  const json = await result.json();

  json.forEach(setting => {
    const newChartSetting = createNewChartConfigFromSetting(chartSetting, setting);
    const id = setting.title.replace(" ", "-");
    const element = createNewChartElement(newChartSetting, id);
    divContainer.insertAdjacentElement("beforeend", element);
    new Chart(divContainer.querySelector("#" + id), newChartSetting);
  });
}

displayCharts();
