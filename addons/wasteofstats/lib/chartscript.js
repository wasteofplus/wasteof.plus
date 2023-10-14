const options = {
  chart: {
    height: '100%',
    maxWidth: '100%',
    type: 'line',
    fontFamily: 'Inter, sans-serif',
    dropShadow: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  tooltip: {
    enabled: true,
    x: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  theme: {
    mode: 'dark'
  },
  stroke: {
    width: 6,
    curve: 'smooth'
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -26
    }
  },
  series: [
    {
      name: 'Clicks',
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: '#1A56DB'
    },
    {
      name: 'CPC',
      data: [6456, 6356, 6526, 6332, 6418, 6500],
      color: '#7E3AF2'
    }
  ],
  legend: {
    show: false
  },
  xaxis: {
    categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
    labels: {
      show: true,
      style: {
        fontFamily: 'Inter, sans-serif',
        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  background: '#fff'
}

console.log('query', document.querySelectorAll('.banner > div > div')[1])

document.querySelectorAll('.banner > div > div')[1].insertAdjacentHTML('beforeend', `
<a href="/users/imadeanaccount/followers" class="inline-flex md:hidden whitespace-nowrap bg-white hover:bg-gray-50 dark:bg-gray-900 transition font-bold text-primary-500 dark:text-primary-300 px-4 py-2 my-1 rounded" data-v-6242d9e8=""><span class="mr-3" data-v-6242d9e8=""><svg style="margin-top: 4px;" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1v14h16m0-9-3-2-3 5-3-2-3 4"/>
</svg></span> <span data-v-6242d9e8="">Statistics</span> <span data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg></span></a>
`)

if (document.getElementById('line-chart') && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById('line-chart'), options)
  chart.render()
}
