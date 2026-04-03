(function (global) {
  'use strict';

  function createDefaultGraph() {
    return {
      nodes: [
        { id: 'sensor-trigger', type: 'sensor trigger' },
        { id: 'vehicle-anomaly', type: 'vehicle anomaly' },
        { id: 'comm-relay', type: 'communication relay' },
        { id: 'traffic-response', type: 'traffic response' }
      ],
      edges: [
        { from: 'sensor-trigger', to: 'vehicle-anomaly' },
        { from: 'vehicle-anomaly', to: 'comm-relay' },
        { from: 'comm-relay', to: 'traffic-response' }
      ]
    };
  }

  function createGraphExecutor(graph) {
    const g = graph || createDefaultGraph();

    function execute(context, events) {
      const outputs = {
        triggerConfirmed: context.sensor && context.sensor.anomalyConfirmed,
        relayUrgency: context.network && context.network.latency < 45 ? 'high' : 'normal',
        responseAction: 'monitor'
      };

      if (outputs.triggerConfirmed && context.vehicles.anomalyCount > 0) {
        outputs.responseAction = 'dispatch-safety-alert';
        events.emit('graph.response', {
          action: outputs.responseAction,
          anomalies: context.vehicles.anomalyCount,
          graphNodes: g.nodes.length
        });
      }

      return outputs;
    }

    return { graph: g, execute };
  }

  global.HighwayDecisionGraph = {
    createDefaultGraph,
    createGraphExecutor
  };
})(window);
