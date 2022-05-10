Chart.plugins.register(ChartDatasourcePrometheusPlugin);

const chartTemplate = "<div class='accordion-body'><div class='card'><div class='card-header'>" +
    "<h5>title</h5><button class='btn btn-primary btn-collapse'>Collapse</button>" +
    "<form action='/delete' method='post'><input type='hidden' name='id' id='chart-id'><button class='btn btn-danger float-end'>Delete</button></form>" +
    "</div><div class='card-body'><div class='collapsable'><div class='row'><canvas id='id'></canvas>" +
    "</div></div></div></div></div>";


// TODO: Remove all hard coded charts
const divContainer = document.querySelector<HTMLDivElement>("#chart-container");
if (!divContainer) {
  throw Error("Chart container not found");
}

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

function registerCollapsableButton() {
  document.querySelectorAll<HTMLButtonElement>(".btn-collapse").forEach((e) => {
    e.addEventListener("click", () => {
      if (e.parentElement && e.parentElement.parentElement) {
        const view = e.parentElement.parentElement.querySelector<HTMLElement>(".collapsable");
        if (!view) {
          throw new ReferenceError("Could not find collapsable");
        }
        view.hidden = !view.hidden;
      }
    });
  });
}

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

function createNewChartElement(chartSetting: object, title: string, id: string) {
  const el = document.createElement('div');
  el.innerHTML = chartTemplate;
  if (!el.firstElementChild) {
    throw Error("Could not create chart element");
  }
  const canvas = el.firstElementChild.querySelector<HTMLCanvasElement>("#id");
  const h5 = el.firstElementChild.querySelector<HTMLHeadingElement>("h5");
  const hidden = el.firstElementChild.querySelector<HTMLInputElement>("#chart-id");

  if (!canvas || !h5 || !hidden) {
    throw Error("Could not create chart element");
  }

  canvas.id = title;
  h5.innerText = title;
  hidden.value = id;
  return el.firstElementChild;
}

async function displayCharts(container: HTMLDivElement) {
  const result = await fetch("/all");
  const json = await result.json();

  json.forEach(setting => {
    const newChartSetting = createNewChartConfigFromSetting(chartSetting, setting);
    const title = setting.title.replace(" ", "-");
    const id = setting._id;
    const element = createNewChartElement(newChartSetting, title, id);
    container.insertAdjacentElement("beforeend", element);
    new Chart(container.querySelector("#" + title), newChartSetting);
  });
}

displayCharts(divContainer).then(() => registerCollapsableButton());
