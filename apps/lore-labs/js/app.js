(function (global) {
  'use strict';

  // State state variables
  let allQuestions = [];
  let sessionQueue = [];
  let currentQuestionIndex = 0;
  let activeSessionResults = {};
  let completedSessionsLedger = [];
  let activeSessionId = '';
  
  // Elements cache
  const elements = {
    cardText: null,
    optionsGrid: null,
    cardMeta: null,
    nextBtn: null,
    hintBtn: null,
    hintBox: null,
    trapBtn: null,
    trapBox: null,
    feedbackOverlay: null,
    nextActionsList: null,
    weakConceptsList: null,
    correctCountVal: null,
    wrongCountVal: null,
    accuracyVal: null,
    ledgerList: null,
    standardSessionBtn: null
  };

  function initApp() {
    // Cache selectors
    elements.cardText = document.getElementById('card-text');
    elements.optionsGrid = document.getElementById('options-grid');
    elements.cardMeta = document.getElementById('card-meta');
    elements.nextBtn = document.getElementById('next-btn');
    elements.hintBtn = document.getElementById('hint-btn');
    elements.hintBox = document.getElementById('hint-box');
    elements.trapBtn = document.getElementById('trap-btn');
    elements.trapBox = document.getElementById('trap-box');
    elements.feedbackOverlay = document.getElementById('feedback-overlay');
    elements.nextActionsList = document.getElementById('next-actions-list');
    elements.weakConceptsList = document.getElementById('weak-concepts-list');
    elements.correctCountVal = document.getElementById('correct-count-val');
    elements.wrongCountVal = document.getElementById('wrong-count-val');
    elements.accuracyVal = document.getElementById('accuracy-val');
    elements.ledgerList = document.getElementById('ledger-list');
    elements.standardSessionBtn = document.getElementById('standard-session-btn');

    // Bind base actions
    elements.standardSessionBtn.addEventListener('click', () => startNewSession());
    elements.nextBtn.addEventListener('click', () => advanceQuestion());
    elements.hintBtn.addEventListener('click', () => toggleHint());
    elements.trapBtn.addEventListener('click', () => toggleTrap());

    // Load Local Ledger History
    loadLedgerHistory();

    // Fetch Questions
    fetch('./data/questions.json')
      .then(res => res.json())
      .then(data => {
        allQuestions = data;
        // Seed default graph based on entire domain layout
        generateDefaultStateGraph();
        // Start automatic session
        startNewSession();
      })
      .catch(err => {
        console.error('Failed to load questions database:', err);
      });
  }

  function loadLedgerHistory() {
    try {
      const stored = localStorage.getItem('lore_labs_ledger');
      completedSessionsLedger = stored ? JSON.parse(stored) : [];
      renderLedger();
    } catch (e) {
      completedSessionsLedger = [];
    }
  }

  function saveLedgerHistory() {
    try {
      localStorage.setItem('lore_labs_ledger', JSON.stringify(completedSessionsLedger));
      renderLedger();
    } catch (e) {
      console.error('Failed to save ledger to localStorage:', e);
    }
  }

  function renderLedger() {
    if (!elements.ledgerList) return;
    elements.ledgerList.innerHTML = '';
    if (completedSessionsLedger.length === 0) {
      elements.ledgerList.innerHTML = '<div class="ledger-item" style="color:var(--text-muted)">No sessions logged yet.</div>';
      return;
    }

    // Display top 5 sessions
    completedSessionsLedger.slice(-5).reverse().forEach(session => {
      const item = document.createElement('div');
      item.className = 'ledger-item';
      const timeStr = new Date(session.evaluatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.innerHTML = `
        <div>
          <div>Session ${session.sessionId.substring(0, 8)}</div>
          <div class="ledger-time">${timeStr} &bull; ${session.totalQuestions} Questions</div>
        </div>
        <div class="ledger-score" style="color: ${session.wrongCount === 0 ? 'var(--accent-green)' : 'var(--text-primary)'}">
          ${session.correctCount} / ${session.totalQuestions}
        </div>
      `;
      elements.ledgerList.appendChild(item);
    });
  }

  function generateDefaultStateGraph() {
    // Generate dummy/default graph from full domain/concept classification using mock empty session
    const mockSession = {
      sessionId: 'INITIAL_SEED',
      questions: allQuestions.slice(0, 15), // Seed first 15 to keep map clean
      results: []
    };
    const defaultGraph = window.ViaLogic.buildConceptGraph(mockSession);
    window.LoreLabsGraph.init('graph-viewport', defaultGraph, (node) => handleGraphNodeClick(node));
  }

  function startNewSession(filterFn = null, filterName = '') {
    activeSessionId = 'SESSION_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    activeSessionResults = {};
    currentQuestionIndex = 0;
    
    // Reset buttons
    elements.nextBtn.style.display = 'none';
    elements.hintBox.classList.remove('show');
    elements.trapBox.classList.remove('show');
    elements.feedbackOverlay.classList.remove('show');

    // Filter queue
    if (filterFn) {
      sessionQueue = allQuestions.filter(filterFn);
      if (sessionQueue.length === 0) {
        sessionQueue = allQuestions.slice(0, 10);
      }
    } else {
      // Pick 10 random questions
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      sessionQueue = shuffled.slice(0, 10);
    }

    renderQuestion();
    updatePanelStats();
  }

  function handleGraphNodeClick(node) {
    if (node.type === 'domain') {
      startNewSession(q => q.dom === node.label, `Domain: ${node.label}`);
    } else if (node.type === 'concept') {
      startNewSession(q => q.hint === node.label || q.trap === node.label || q.dom === node.domain, `Concept: ${node.label}`);
    }
  }

  function renderQuestion() {
    if (sessionQueue.length === 0) return;
    const question = sessionQueue[currentQuestionIndex];

    elements.cardMeta.innerText = `Question ${currentQuestionIndex + 1} of ${sessionQueue.length} &bull; ${question.dom}`;
    elements.cardText.innerText = question.q;

    // Reset hints & traps text
    elements.hintBox.innerText = `Hint: ${question.hint || 'No hint available.'}`;
    elements.trapBox.innerText = `Trap: ${question.trap || 'Beware of subtle traps.'}`;

    // Options Grid setup
    elements.optionsGrid.innerHTML = '';
    
    // Gather and shuffle options
    const options = [
      { text: question.correct, isCorrect: true },
      { text: question.l, isCorrect: false },
      { text: question.r, isCorrect: false }
    ].sort(() => 0.5 - Math.random());

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = opt.text;
      btn.addEventListener('click', () => handleOptionSelected(btn, opt, question));
      elements.optionsGrid.appendChild(btn);
    });

    elements.nextBtn.style.display = 'none';
    elements.feedbackOverlay.classList.remove('show');
    elements.hintBox.classList.remove('show');
    elements.trapBox.classList.remove('show');
  }

  function handleOptionSelected(selectedBtn, option, question) {
    // Disable all options
    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    // Record response
    const questionId = question.id || 'q_' + question.id;
    activeSessionResults[questionId] = {
      id: questionId,
      answer: option.text,
      isCorrect: option.isCorrect
    };

    // Color options
    buttons.forEach(btn => {
      if (btn.innerText === question.correct) {
        btn.classList.add('correct');
      } else if (btn === selectedBtn && !option.isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Run custom ViaLogic question evaluation
    const questionEval = window.ViaLogic.evaluateQuestion(question, activeSessionResults[questionId]);

    // Show Feedback Overlay
    elements.feedbackOverlay.innerHTML = `
      <div class="feedback-title ${option.isCorrect ? 'correct' : 'wrong'}">
        <span>${option.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
      </div>
      <div>${question.logic || questionEval.explanationSignal}</div>
      ${question.trap ? `<div class="feedback-trap">💡 <strong>Avoid the Trap:</strong> ${question.trap}</div>` : ''}
    `;
    elements.feedbackOverlay.classList.add('show');

    // Display Next button
    elements.nextBtn.style.display = 'block';
  }

  function advanceQuestion() {
    if (currentQuestionIndex + 1 < sessionQueue.length) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      finishSession();
    }
  }

  function finishSession() {
    // Create Normalized session structure
    const sessionPayload = {
      sessionId: activeSessionId,
      questions: sessionQueue,
      results: Object.values(activeSessionResults)
    };

    // Run ViaLogic Session Evaluation
    const sessionEval = window.ViaLogic.evaluateSession(sessionPayload);
    sessionEval.evaluatedAt = new Date().toISOString();

    // Redraw cognitive map graph dynamically using D3 force layout
    // Merge result states (correct/wrong) into the graph node list
    const evaluatedGraph = sessionEval.conceptGraph;
    evaluatedGraph.nodes.forEach(node => {
      if (node.type === 'concept') {
        // Find if this concept was answered correct or incorrect in this session
        const relatedQuestion = sessionQueue.find(q => {
          const evalItem = sessionEval.questionEvaluations.find(e => e.questionId === q.id);
          return evalItem && evalItem.concept === node.label;
        });
        if (relatedQuestion) {
          const result = activeSessionResults[relatedQuestion.id];
          if (result) {
            node.correct = result.isCorrect;
            node.weak = !result.isCorrect;
          }
        }
      }
    });

    window.LoreLabsGraph.init('graph-viewport', evaluatedGraph, (node) => handleGraphNodeClick(node));

    // Update Next Actions list
    elements.nextActionsList.innerHTML = '';
    sessionEval.nextActions.forEach(action => {
      const item = document.createElement('div');
      item.className = `action-item ${action.type}`;
      item.innerHTML = `
        <div class="action-title">${action.label}</div>
        <div class="action-reason">${action.reason}</div>
      `;
      item.addEventListener('click', () => {
        if (action.type === 'review') {
          // Practice questions mapped to this weak concept
          startNewSession(q => q.hint.toLowerCase().includes(action.label.replace('Review ', '').toLowerCase()) || q.q.toLowerCase().includes(action.label.replace('Review ', '').toLowerCase()));
        } else if (action.type === 'practice') {
          // Practice entire domain
          startNewSession(q => q.dom.toLowerCase().includes(action.label.replace('Practice ', '').toLowerCase()));
        } else {
          startNewSession();
        }
      });
      elements.nextActionsList.appendChild(item);
    });

    // Update Weak Concepts list
    elements.weakConceptsList.innerHTML = '';
    if (sessionEval.weakConcepts.length === 0) {
      elements.weakConceptsList.innerHTML = '<div style="color:var(--text-secondary);font-size:13px">No weaknesses found. Great work!</div>';
    } else {
      sessionEval.weakConcepts.forEach(weak => {
        const item = document.createElement('div');
        item.className = 'weakness-item';
        item.innerHTML = `
          <span>${weak.name}</span>
          <span class="weakness-count">${weak.count} Missed</span>
        `;
        item.addEventListener('click', () => {
          // Filter to practice this specific weak concept
          startNewSession(q => q.hint === weak.name || q.q.toLowerCase().includes(weak.name.toLowerCase()));
        });
        elements.weakConceptsList.appendChild(item);
      });
    }

    // Save session to history ledger
    completedSessionsLedger.push({
      sessionId: sessionEval.sessionId,
      totalQuestions: sessionEval.totalQuestions,
      correctCount: sessionEval.correctCount,
      wrongCount: sessionEval.wrongCount,
      evaluatedAt: sessionEval.evaluatedAt
    });
    saveLedgerHistory();

    // Show completion alert card
    elements.cardMeta.innerText = `Session Complete`;
    elements.cardText.innerHTML = `
      <div style="text-align:center;padding:20px 0">
        <h2 style="color:var(--accent-cyan);margin-bottom:12px">Session Complete!</h2>
        <p style="font-size:15px;color:var(--text-secondary)">
          You scored <strong>${sessionEval.correctCount} out of ${sessionEval.totalQuestions}</strong> correctly.
        </p>
        <p style="font-size:13px;color:var(--text-muted);margin-top:8px">
          The knowledge network graph has been populated with your cognitive state.
        </p>
      </div>
    `;
    elements.optionsGrid.innerHTML = '';
    elements.nextBtn.style.display = 'none';
    elements.feedbackOverlay.classList.remove('show');

    // Update overall accuracy stats
    updatePanelStats();
  }

  function updatePanelStats() {
    let totalQuestions = 0;
    let totalCorrect = 0;

    completedSessionsLedger.forEach(s => {
      totalQuestions += s.totalQuestions || 0;
      totalCorrect += s.correctCount || 0;
    });

    elements.correctCountVal.innerText = totalCorrect;
    elements.wrongCountVal.innerText = totalQuestions - totalCorrect;
    elements.accuracyVal.innerText = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) + '%' : '0%';
  }

  function toggleHint() {
    elements.hintBox.classList.toggle('show');
  }

  function toggleTrap() {
    elements.trapBox.classList.toggle('show');
  }

  global.LoreLabsApp = {
    init: initApp
  };
})(window);
