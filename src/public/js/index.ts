Chart.plugins.register(ChartDatasourcePrometheusPlugin);

const ctxCpu = document.getElementById('cpuChart').getContext('2d');
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

const ctxMemory = document.getElementById('memoryChart').getContext('2d');
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

const ctxDisk = document.getElementById('diskChart').getContext('2d');
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

