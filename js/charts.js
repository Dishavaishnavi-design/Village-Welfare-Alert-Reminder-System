window.charts = {
  // Global reference map to track active chart instances for clean disposal
  instances: {},

  /**
   * Render a Category Breakdown Chart
   * @param {string} canvasId - Element ID for the canvas
   * @param {Object} data - Category counts data e.g. { Student: 5, Farmer: 12, ... }
   */
  renderCategoryChart(canvasId, data) {
    this.destroyChart(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(data);
    const values = Object.values(data);

    // Fallback if Chart.js is not loaded
    if (typeof Chart === 'undefined') {
      this.renderFallbackBarChart(canvas, labels, values, 'Citizens by Category', '#0b6a4f');
      return;
    }

    try {
      const ctx = canvas.getContext('2d');
      this.instances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#0b6a4f', // Forest Green
              '#0d6efd', // Royal Blue
              '#fd7e14', // Orange
              '#198754', // Green
              '#6f42c1', // Purple
              '#0dcaf0'  // Cyan
            ],
            borderWidth: 2,
            borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#151f32' : '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: this.getTextColor(),
                font: { family: 'Inter', size: 12 }
              }
            }
          }
        }
      });
    } catch (err) {
      console.warn("Chart.js failed to render, drawing fallback:", err);
      this.renderFallbackBarChart(canvas, labels, values, 'Citizens by Category', '#0b6a4f');
    }
  },

  /**
   * Render a Scheme Application Stats Chart
   * @param {string} canvasId - Element ID
   * @param {Object} data - Scheme application counts e.g. { 'Old Age': 8, 'Scholarship': 15 }
   */
  renderSchemeDistributionChart(canvasId, data) {
    this.destroyChart(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (typeof Chart === 'undefined') {
      this.renderFallbackBarChart(canvas, labels, values, 'Registrations by Scheme', '#0d6efd');
      return;
    }

    try {
      const ctx = canvas.getContext('2d');
      this.instances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels.map(l => l.length > 18 ? l.substring(0, 15) + '...' : l),
          datasets: [{
            label: 'Total Enrollments',
            data: values,
            backgroundColor: '#0d6efd',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: this.getTextColor(), font: { family: 'Inter', size: 10 } }
            },
            y: {
              grid: { color: this.getBorderColor() },
              ticks: { color: this.getTextColor(), precision: 0 }
            }
          }
        }
      });
    } catch (err) {
      this.renderFallbackBarChart(canvas, labels, values, 'Registrations by Scheme', '#0d6efd');
    }
  },

  /**
   * Render Citizen Eligibility Status Chart
   */
  renderEligibilityStatusChart(canvasId, data) {
    this.destroyChart(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(data); // e.g. ['Verified', 'Pending', 'Rejected']
    const values = Object.values(data);

    if (typeof Chart === 'undefined') {
      this.renderFallbackBarChart(canvas, labels, values, 'Eligibility Status Distribution', '#198754');
      return;
    }

    try {
      const ctx = canvas.getContext('2d');
      this.instances[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#198754', // Verified (Green)
              '#fd7e14', // Pending (Orange)
              '#dc3545'  // Rejected (Red)
            ],
            borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#151f32' : '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: this.getTextColor(),
                font: { family: 'Inter', size: 12 }
              }
            }
          }
        }
      });
    } catch (err) {
      this.renderFallbackBarChart(canvas, labels, values, 'Eligibility Status', '#198754');
    }
  },

  // Helper: Destroy active chart to prevent memory leaks or redraw bugs
  destroyChart(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },

  // Helper to fetch theme-based text color
  getTextColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '#94a3b8' : '#64748b';
  },

  // Helper to fetch theme-based border color
  getBorderColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '#273549' : '#e2e8f0';
  },

  /**
   * Custom HTML/SVG fallback bar charts generator in case CDN is offline.
   */
  renderFallbackBarChart(canvas, labels, values, title, colorHex) {
    const parent = canvas.parentElement;
    if (!parent) return;

    // Create wrapper
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'fallback-chart-wrapper flex flex-col gap-3 p-3 w-full h-full';
    fallbackDiv.style.minHeight = '220px';

    const maxVal = Math.max(...values, 1);

    let barsHTML = '';
    labels.forEach((label, i) => {
      const percentage = (values[i] / maxVal) * 100;
      barsHTML += `
        <div class="flex align-center gap-3 w-full text-xs">
          <div class="text-left font-medium" style="width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${label}">${label}</div>
          <div class="flex-grow" style="background-color: var(--border-color); height: 16px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: ${colorHex}; width: ${percentage}%; height: 100%; border-radius: 4px; transition: width 0.5s ease;"></div>
          </div>
          <div class="font-bold text-right" style="width: 25px;">${values[i]}</div>
        </div>
      `;
    });

    fallbackDiv.innerHTML = `
      <h6 class="text-sm font-semibold mb-2 text-center" style="color: var(--text-muted);">${title}</h6>
      <div class="flex flex-col gap-2 flex-grow justify-center">${barsHTML}</div>
    `;

    // Hide original canvas, append fallback
    canvas.style.display = 'none';
    const oldFallback = parent.querySelector('.fallback-chart-wrapper');
    if (oldFallback) parent.removeChild(oldFallback);
    parent.appendChild(fallbackDiv);
  }
};
