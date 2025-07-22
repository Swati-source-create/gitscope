// chart.js

/**
 * Renders a language usage pie chart using Chart.js
 * @param {Object} languageCounts - Key-value pairs of language name and count
 */
export function renderLanguageChart(languageCounts) {
  const languageChartEl = document.getElementById("languageChart");

  if (languageChartEl && Object.keys(languageCounts).length > 0) {
    languageChartEl.style.display = "block";
    const ctx = languageChartEl.getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(languageCounts),
        datasets: [{
          data: Object.values(languageCounts),
          backgroundColor: [
            "#007bff", // Blue
            "#28a745", // Green
            "#ffc107", // Yellow
            "#dc3545", // Red
            "#6610f2", // Purple
            "#20c997", // Teal
            "#6f42c1"  // Indigo
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Languages Used Across Public Repositories"
          }
        }
      }
    });
  }
}
