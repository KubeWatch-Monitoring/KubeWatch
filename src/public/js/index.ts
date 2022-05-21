Chart.plugins.register(ChartDatasourcePrometheusPlugin);
const chartTemplate = "<div class='accordion-body'><div class='card'><div class='card-header'>" +
    "<h5>title</h5>" +
    "<form action='/delete' method='post'>" +
    "<button type='button' class='btn btn-primary btn-collapse'>Collapse</button>" +
    "<input type='hidden' name='id' id='chart-id'>" +
    "<button class='btn btn-danger float-end'>Delete</button></form></div>" +
    "<div class='card-body'><div class='collapsable'><div class='row'>" +
    "<canvas id='id'></canvas>" +
    "</div></div></div></div></div>";

(async () => {
  const divContainer = document.querySelector<HTMLDivElement>("#chart-container");
  if (!divContainer) {
    throw Error("Chart container not found");
  }

  const chartSetting = {
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

  await displayCharts(divContainer, chartSetting)
  registerCollapsableButton();
})();

function registerCollapsableButton() {
  document.querySelectorAll<HTMLButtonElement>(".btn-collapse").forEach((e) => {
    e.addEventListener("click", () => {
      if (e.parentElement && e.parentElement.parentElement && e.parentElement.parentElement.parentElement) {
        const view = e.parentElement.parentElement.parentElement.querySelector<HTMLElement>(".collapsable");
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

function createNewChartConfigFromSetting(chartSetting: any, setting: any) {
  const config = cloneObject(chartSetting) as any;
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

  canvas.id = id;
  h5.innerText = title;
  hidden.value = id;
  return el.firstElementChild;
}

async function displayCharts(container: HTMLDivElement, chartSetting: object) {
  const result = await fetch("/all");
  const dashboardCharts = await result.json();

  dashboardCharts.forEach((dbChart: any) => {
    const newChartSetting = createNewChartConfigFromSetting(chartSetting, dbChart);
    const title = dbChart.title.replace(" ", "-");
    const id = `chart-${dbChart._id}`;
    const element = createNewChartElement(newChartSetting, title, id);
    container.insertAdjacentElement("beforeend", element);
    const chart = new Chart(container.querySelector("#" + id), newChartSetting);
  });
}

