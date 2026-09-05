const { execFile } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--disable-gpu',
  'about:blank'
];

const proc = execFile(edgePath, args);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9224/json/list');
    const tabs = await listRes.json();
    const tab = tabs[0];
    if (!tab || !tab.webSocketDebuggerUrl) {
      console.log('No tab found');
      proc.kill();
      return;
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    const networkRequests = [];
    const failedRequests = [];
    let totalBytes = 0;
    const consoleMessages = [];

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data.result);
        callbacks.delete(data.id);
      }

      if (data.method === 'Network.responseReceived') {
        const resp = data.params.response;
        networkRequests.push({ url: resp.url, status: resp.status, mimeType: resp.mimeType });
        if (resp.status >= 400) {
          failedRequests.push({ url: resp.url, status: resp.status });
        }
      }

      if (data.method === 'Network.dataReceived') {
        totalBytes += data.params.dataLength || 0;
      }

      if (data.method === 'Console.messageAdded') {
        consoleMessages.push(data.params.message);
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = (data.params.args || []).map(a => a.value || a.description || '').join(' ');
        consoleMessages.push({ type: data.params.type, text });
      }
    });

    ws.addEventListener('open', async () => {
      await send('Page.enable');
      await send('Network.enable');
      await send('Console.enable');
      await send('Runtime.enable');
      await send('Performance.enable');

      console.log('Navigating to http://localhost:8000 ...');
      await send('Page.navigate', { url: 'http://localhost:8000' });

      // Wait 6 seconds for page load, animations, and image decodes
      setTimeout(async () => {
        const perfMetrics = await send('Performance.getMetrics');
        const metricsMap = {};
        (perfMetrics.metrics || []).forEach(m => { metricsMap[m.name] = m.value; });

        console.log('\n=========================================');
        console.log('PERFORMANCE & HEALTH AUDIT RESULTS');
        console.log('=========================================');
        console.log(`Total Network Requests: ${networkRequests.length}`);
        console.log(`Total Bytes Transferred: ${(totalBytes / 1024).toFixed(1)} KB`);
        console.log(`Failed Requests (4xx/5xx): ${failedRequests.length}`);
        if (failedRequests.length > 0) {
          console.log('Failed details:', failedRequests);
        }

        const errors = consoleMessages.filter(m => m.level === 'error' || m.type === 'error');
        console.log(`Console Errors: ${errors.length}`);
        if (errors.length > 0) {
          console.log('Console Errors:', errors);
        }

        const warnings = consoleMessages.filter(m => m.level === 'warning' || m.type === 'warning');
        console.log(`Console Warnings: ${warnings.length}`);

        console.log(`JS Heap Used: ${((metricsMap['JSHeapUsedSize'] || 0) / 1024 / 1024).toFixed(2)} MB`);
        console.log(`DOM Node Count: ${metricsMap['Nodes'] || 'N/A'}`);
        console.log(`Layout Count: ${metricsMap['LayoutCount'] || 'N/A'}`);

        ws.close();
        proc.kill();
        process.exit(0);
      }, 6000);
    });
  } catch (err) {
    console.error('Audit script error:', err);
    proc.kill();
    process.exit(1);
  }
}, 1500);
