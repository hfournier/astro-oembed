# Bundle providers.json in the package at publish time

We snapshot `https://oembed.com/providers.json` into `src/data/providers.json` and commit it to the repo. A `npm run update-providers` script refreshes it before each release.

We chose this over fetching at the user's build time because a network dependency on oembed.com would make user builds fragile — a transient outage or rate limit would break their site build. The tradeoff is that the snapshot may lag behind newly-added providers, but the list changes infrequently and the update cycle is deliberate and reviewable.
