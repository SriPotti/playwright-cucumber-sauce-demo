const fs = require('fs');
const reporter = require('multiple-cucumber-html-reporter');
if (!fs.existsSync('reports/cucumber-report.json')) {
  console.log('No JSON report found. Run tests first.');
  process.exit(0);
}
reporter.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  reportName: 'Sauce Demo BDD Automation Report',
  pageTitle: 'Sauce Demo Test Results',
  displayDuration: true,
  metadata: {
    browser: { name: process.env.BROWSER || 'chromium' },
    device: 'Desktop',
    platform: { name: process.platform },
    testEnvironment: 'Public demo'
  }
});
