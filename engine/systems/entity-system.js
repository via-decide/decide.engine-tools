(function (global) {
  'use strict';

  function createEntitySystem() {
    const entityManager = global.EntityManager.createEntityManager();
    const componentRegistry = global.ComponentRegistry.createComponentRegistry();
    const systemRunner = global.SystemRunner.createSystemRunner();

    return {
      spawnEntity() {
        return entityManager.spawn();
      },
      destroyEntity(entityId) {
        entityManager.destroy(entityId);
      },
      attachComponent(entityId, type, value) {
        componentRegistry.attach(entityId, type, value);
      },
      getComponent(entityId, type) {
        return componentRegistry.get(entityId, type);
      },
      registerSystem(name, fn) {
        systemRunner.register(name, fn);
      },
      runSystems(frameContext) {
        systemRunner.run(frameContext, {
          entities: entityManager,
          components: componentRegistry
        });
      },
      reset() {
        entityManager.clear();
        componentRegistry.clear();
        systemRunner.reset();
      }
    };
  }

  global.EntitySystem = { createEntitySystem };
})(window);
