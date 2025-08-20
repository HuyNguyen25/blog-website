/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307")

  // update collection data
  unmarshal({
    "name": "posts"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307")

  // update collection data
  unmarshal({
    "name": "blogs"
  }, collection)

  return app.save(collection)
})
