function startSimulation() {
    const numPages = parseInt(document.getElementById('numPages').value);
    const numFrames = parseInt(document.getElementById('numFrames').value);
  
    if (numPages < 1 || numFrames < 1) {
      alert("Enter valid values for pages and frames.");
      return;
    }
  
    const references = Array.from({ length: 10 }, () => Math.floor(Math.random() * numPages));
    const frameQueue = [];
    const frameMap = {};
    const pageTable = Array(numPages).fill(null);
  
    let hits = 0;
    let faults = 0;
  
    document.getElementById('simulationArea').classList.remove('hidden');
    document.getElementById('pageReferences').innerHTML = '';
    document.getElementById('pageTableBody').innerHTML = '';
    document.getElementById('frameContainer').innerHTML = '';
    document.getElementById('hits').textContent = '0';
    document.getElementById('faults').textContent = '0';
  
    // Display page references
    references.forEach(p => {
      const div = document.createElement('div');
      div.className = 'page';
      div.textContent = p;
      document.getElementById('pageReferences').appendChild(div);
    });
  
    // Simulate FIFO Paging
    references.forEach((page, i) => {
      if (frameMap.hasOwnProperty(page)) {
        hits++;
      } else {
        faults++;
        if (frameQueue.length >= numFrames) {
          const removed = frameQueue.shift();
          delete frameMap[removed];
          pageTable[removed] = null;
        }
  
        const frameNum = frameQueue.length;
        frameQueue.push(page);
        frameMap[page] = frameNum;
        pageTable[page] = frameNum;
      }
    });
  
    // Fill Page Table
    pageTable.forEach((frame, page) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${page}</td><td>${frame !== null ? frame : '-'}</td>`;
      document.getElementById('pageTableBody').appendChild(row);
    });
  
    // Fill Frames
    frameQueue.forEach(page => {
      const frameDiv = document.createElement('div');
      frameDiv.className = 'frame';
      frameDiv.textContent = page;
      document.getElementById('frameContainer').appendChild(frameDiv);
    });
  
    document.getElementById('hits').textContent = hits;
    document.getElementById('faults').textContent = faults;
  }
  