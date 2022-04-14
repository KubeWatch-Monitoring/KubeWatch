Chart.plugins.register(ChartDatasourcePrometheusPlugin);

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: "https://prometheus.demo.do.prometheus.io",
          baseURL: "/api/v1",   // default value
        },
        query: 'sum by (job) (go_gc_duration_seconds)',
        timeRange: {
          type: 'relative',

          // from 12 hours ago to now
          start: -12 * 60 * 60 * 1000,
          end: 0,
        },
      },
    },
  },
});

document.querySelectorAll(".btn-collapse").forEach((e) => {
  e.addEventListener("click", () => {
    if (e.parentElement) {
      const view = e.parentElement.querySelector<HTMLElement>(".collapsable");
      if (!view) {
        throw new ReferenceError("Could not find collapsable");
      }
      view.hidden = !view.hidden;
    }
  });
});

