function startSimulation() {
  const numPages = parseInt(document.getElementById('numPages').value);
  const numFrames = parseInt(document.getElementById('numFrames').value);

  if (numPages < 1 || numFrames < 1) {
    alert("Enter valid values for pages and frames.");
    return;
  }

  const references = Array.from({ length: 10 }, () => Math.floor(Math.random() * numPages));
  const frameQueue = [];
  const frameMap = {}; // page → frame number
  const pageTable = Array(numPages).fill(null);

  let hits = 0;
  let faults = 0;

  // Reset UI
  document.getElementById('simulationArea').classList.remove('hidden');
  document.getElementById('pageReferences').innerHTML = '';
  document.getElementById('pageTableBody').innerHTML = '';
  document.getElementById('frameContainer').innerHTML = '';
  document.getElementById('hits').textContent = '0';
  document.getElementById('faults').textContent = '0';

  // Show reference string
  references.forEach(p => {
    const div = document.createElement('div');
    div.className = 'page';
    div.textContent = p;
    document.getElementById('pageReferences').appendChild(div);
  });

  // Simulate FIFO Paging with correct frame assignment
  references.forEach(page => {
    if (frameMap.hasOwnProperty(page)) {
      hits++;
    } else {
      faults++;

      let frameNum;

      if (frameQueue.length < numFrames) {
        // Use next available frame
        frameNum = frameQueue.length;
      } else {
        // Remove oldest page and reuse its frame
        const removed = frameQueue.shift();
        frameNum = frameMap[removed];  // get old frame number
        delete frameMap[removed];
        pageTable[removed] = null;
      }

      // Add new page
      frameQueue.push(page);
      frameMap[page] = frameNum;
      pageTable[page] = frameNum;
    }
  });

  // Build Page Table
  pageTable.forEach((frame, page) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${page}</td><td>${frame !== null ? frame : '-'}</td>`;
    document.getElementById('pageTableBody').appendChild(row);
  });

  // Show Frames
  const sortedPagesInFrame = Object.entries(frameMap)
    .sort((a, b) => a[1] - b[1]) // sort by frame number
    .map(([page]) => parseInt(page));

  sortedPagesInFrame.forEach(page => {
    const frameDiv = document.createElement('div');
    frameDiv.className = 'frame';
    frameDiv.textContent = page;
    document.getElementById('frameContainer').appendChild(frameDiv);
  });

  // Show hit/fault count
  document.getElementById('hits').textContent = hits;
  document.getElementById('faults').textContent = faults;
}
