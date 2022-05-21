Chart.plugins.register(ChartDatasourcePrometheusPlugin);

(async () => {
  const config = {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
      animation: {
        duration: 0,
      },
      plugins: {
        'datasource-prometheus': {
          prometheus: {
            endpoint: window.location.origin,
            baseURL: '/prometheus/endpoint',
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
  };

  const ctx = document.querySelector<HTMLCanvasElement>('#chart').getContext('2d');
  const chart = new Chart(ctx, config);

  const chartTitle = document.querySelector<HTMLButtonElement>("#chart-title");
  const btnPreview = document.querySelector<HTMLButtonElement>("#btn-preview");

  const txtPromql = document.querySelector<HTMLInputElement>("#promql");
  const txtTitle = document.querySelector<HTMLInputElement>("#title");
  const txtStart = document.querySelector<HTMLInputElement>("#start");
  const txtEnd = document.querySelector<HTMLInputElement>("#end");
  const txtInterval = document.querySelector<HTMLInputElement>("#updateInterval");
  const txtType = document.querySelector<HTMLSelectElement>("#type");

  btnPreview.addEventListener("click", () => {
    const ONE_SECOND = 1000;
    const prometheusConfig = config.options.plugins['datasource-prometheus'];
    const promql = txtPromql.value;
    const title = txtTitle.value;
    const start = Math.abs(parseFloat(txtStart.value)) * -ONE_SECOND;
    const end = Math.abs(parseInt(txtEnd.value)) * -ONE_SECOND;
    const updateInterval = Math.abs(parseInt(txtInterval.value)) * ONE_SECOND;
    const type = txtType.value;


    chartTitle.innerText = title;
    prometheusConfig.query = promql;
    prometheusConfig.timeRange.start = start;
    prometheusConfig.timeRange.end = end;
    prometheusConfig.timeRange.msUpdateInterval = updateInterval;
    prometheusConfig.timeRange.type = type;
  });
  document.querySelectorAll(".btn-collapse").forEach((e) => {
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

})();
