# Endpoints

- "/"
  - Splash page.
  - Explains the site's main concept.
  - Contains link to data dashboard.
- "/snapshot"
  - Gives general stats concerning the storefront as a whole.
- "/analysis"
  - Displays recommendations and market forecasts based on the current and upcoming state of the storefront.
- "/search"
  - Searches are performed using the search bar on the website header.
  - If a blank search is returned, the user is navigated to this page.
  - Search box with brief searching guide.
- "/search/:queryString"
  - If search was performed with header search box, user is redirected here.
  - Displays games that match the search term.
- "/search/:appId"
  - Displays statistics about a specific game.
- "/about"
  - Site explanation, personal info, and github link

<!-- # Endpoints v1

- "/"
  - Home page.
  - Displays general marketplace statistics.
- "/search"
  - Search landing page.
  - Displays games matching search.
- "/search/:appId"
  - Displays statistics about specific game.
- "/analysis"
  - Displays recommendations and market forecasts based on the current and upcoming state of the storefront. -->

<!-- - "/ccu"
  - Gives stats related to the number of concurent users playing games.
- "/genres"
  - Gives stats specific to game genres.
- "/tags"
  - Gives stats related to user-generated tags.
- "/upcoming"
  - Gives stats related to upcoming titles.
- "/popular"
  - Gives stats related to popular games.
- "/developers"
  - Gives stats related to developers.
- "/publishers"
  - Gives stats related to publishers. -->
