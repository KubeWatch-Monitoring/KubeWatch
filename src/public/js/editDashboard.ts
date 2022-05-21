Chart.plugins.register(ChartDatasourcePrometheusPlugin);

(async () => {
  const config = {
    type: 'line',
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
          query: "sum by (pod) (container_cpu_system_seconds_total{namespace!~\"kube-system|monitoring|kubernetes-dashboard\", pod!~\"\"})",
          timeRange: {
            type: "relative",
            // from 1 hours ago to now
            start: -1 * 60 * 60 * 1000,
            end: 0,
            msUpdateInterval: 5000,
          },
        },
      },
    },
  };

  const canvasElement = document.querySelector<HTMLCanvasElement>('#chart') as HTMLCanvasElement;
  const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  const chart = new Chart(ctx, config);

  const chartTitle = document.querySelector<HTMLButtonElement>("#chart-title") as HTMLButtonElement;
  const btnPreview = document.querySelector<HTMLButtonElement>("#btn-preview") as HTMLButtonElement;

  const txtPromql = document.querySelector<HTMLInputElement>("#promql") as HTMLInputElement;
  const txtTitle = document.querySelector<HTMLInputElement>("#title") as HTMLInputElement;
  const txtStart = document.querySelector<HTMLInputElement>("#start") as HTMLInputElement;
  const txtEnd = document.querySelector<HTMLInputElement>("#end") as HTMLInputElement;
  const txtInterval = document.querySelector<HTMLInputElement>("#updateInterval") as HTMLInputElement;
  const txtType = document.querySelector<HTMLSelectElement>("#type") as HTMLSelectElement;

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
