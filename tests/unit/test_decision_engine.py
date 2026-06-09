import unittest

from decision_engine.main import run_workflow


class DecisionEngineWorkflowTests(unittest.TestCase):
    def test_workflow_runs_and_returns_recommendation(self):
        result = run_workflow()
        self.assertIn(result['recommendation'], {'Expand APAC', 'Delay Launch'})
        self.assertIn(result['execution']['status'], {'executed', 'deferred'})
        self.assertGreaterEqual(result['confidence'], 0.0)
        self.assertLessEqual(result['confidence'], 1.0)


if __name__ == '__main__':
    unittest.main()
