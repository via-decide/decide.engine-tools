"""Decision Intelligence Engine entrypoint workflow."""
from __future__ import annotations

import os
import sys

if __package__ is None or __package__ == '':
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from decision_engine.context.context_manager import ContextManager
from decision_engine.evidence.evidence_collector import EvidenceCollector
from decision_engine.reasoning.hypothesis_generator import HypothesisGenerator
from decision_engine.reasoning.reasoning_chain import ReasoningChain
from decision_engine.simulation.scenario_tree import ScenarioTree
from decision_engine.analysis.risk_engine import RiskEngine
from decision_engine.analysis.confidence_estimator import ConfidenceEstimator
from decision_engine.recommendation.decision_recommender import DecisionRecommender
from decision_engine.engine.autonomous_runner import AutonomousRunner, RunnerCondition
from decision_engine.history.decision_history import DecisionHistory, DecisionRecord
from decision_engine.feedback.feedback_engine import FeedbackEngine


def run_workflow() -> dict:
    context = ContextManager().create_context(
        decision_id='DEC-100',
        objective='Choose market entry strategy',
        constraints={'budget': 120, 'deadline_days': 90, 'max_risk': 0.6},
        environment={'market_volatility': 'medium', 'competition': 'high'},
    )

    collector = EvidenceCollector()
    evidence = collector.collect([
        {'source': 'market-report', 'claim': 'Demand is increasing in APAC', 'weight': 0.85},
        {'source': 'finance-team', 'claim': 'Current runway supports expansion', 'weight': 0.75},
    ])

    hypotheses = HypothesisGenerator().generate(context, evidence)
    chain = ReasoningChain().build_chain(evidence, hypotheses)

    options = {
        'Expand APAC': {'cost': 90, 'uncertainty': 0.45, 'impact': 0.9},
        'Delay Launch': {'cost': 30, 'uncertainty': 0.2, 'impact': 0.45},
    }

    scenario_tree = ScenarioTree()
    scenario_root = scenario_tree.build({k: v['impact'] for k, v in options.items()})

    risk_engine = RiskEngine()
    risk_scores = risk_engine.score_options(options)

    recommender = DecisionRecommender()
    recommendation, rec_stats = recommender.recommend(options, evidence)

    confidence = ConfidenceEstimator().estimate(evidence, risk_scores[recommendation])

    runner = AutonomousRunner()
    runner.add_condition(RunnerCondition('min-confidence', lambda s: s.get('confidence', 0) >= 0.6))
    runner.add_condition(RunnerCondition('max-risk', lambda s: s.get('risk', 1) <= 0.6))
    execution = runner.execute_if_ready(recommendation, {'confidence': confidence, 'risk': risk_scores[recommendation]})

    history = DecisionHistory()
    history.add_record(DecisionRecord('DEC-100', recommendation, confidence, 'success' if execution['status'] == 'executed' else 'pending'))

    feedback = FeedbackEngine().summarize(execution, confidence)

    return {
        'context': context,
        'hypotheses': hypotheses,
        'reasoning_chain': chain,
        'scenario_expected_value': scenario_tree.expected_value(scenario_root),
        'risk_scores': risk_scores,
        'recommendation': recommendation,
        'recommendation_stats': rec_stats,
        'confidence': confidence,
        'execution': execution,
        'feedback': feedback,
        'history': history.as_dicts(),
    }


if __name__ == '__main__':
    result = run_workflow()
    print('Decision workflow complete:')
    print(result['recommendation'], result['execution'])
