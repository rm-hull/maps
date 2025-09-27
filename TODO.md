# Ideas / TODO's

- Convert this list to GitHub issues!

- Add a **debug** tab to the settings with some instructions about what effect setting the debug flags would do.
  - Store debug flags under general settings
  - Make layers control sticky (i.e. conditionally ignore `onMouseLeave` events)
  - Enable react query devtools via debug flag
  - Add a control indicator on the map showing a count of active debug flags.

- Improve search function - rather than just flying to the first matched entry, if there are multiple matches,
  pop up a listbox and let the user pick which one.
  - Additionally, show a marker pin for the selected location, with a `<PointOfInterest/>` pop-out.
  - Implement auto-complete / auto-suggest on the search function as the user types.
  - Consider using [nominatim API](https://nominatim.org/) for search instead of OS Names API.
 
- Add tests.

- Fix outstanding eslint issues.
  - Improve/rationalize eslint config.

- Improve README.md front material.

- Move `useLocalStorage()` hook into its own [npmjs](https://npmjs.org) package.
  - Refactor to use jotai atom as the primary store for reading, fetching from storage initially and only updating local storage on write back.

- Add dark mode theming to settings dialog.

- Collect up all attributions for tile layers and other data sources, and list them all in a tab on the settings dialog.

- Add control to settings to allow user to determine how long the GPS tracking stays active for.

- Add ability to record and upload a GPS route to user's Google drive.
  - Improve UX around current GPS route selection (e.g. remember previous URLs, picker for nearby tracks from [gps-routes-api](https://github.com/rm-hull/gps-routes-api))
  - Research other APIs that might provide nearby routes that could be integrated.
 
- Improve content in the `<About />` component, describing various features that may otherwise not be obvious.
  - Revamp README.md content in line with above.
 
- See if it is feasible to have a single cluster across custom overlay layers.

- Add shortcut key access for GPS beacon, settings dialog, etc.
