# Isochrone & Route Generator Web App

## Project Overview

IsoRouteMap is a practice project developed using TypeScript in Visual Studio Code, integrating technologies like Vaadin, Leaflet, OpenStreetMap, and the OpenRouteService API. The application is designed to demonstrate capabilities in geographic data manipulation and visualization, focusing on isochrone generation and multi-modal route planning. It serves as a portfolio project to showcase the use of modern web technologies in handling GIS-related tasks.

## Technologies Used

- **TypeScript**: Used as the primary programming language, enhancing JavaScript with type safety.
- **Vaadin**: A progressive web application framework used to build the UI components.
- **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.
- **OpenStreetMap**: Serves as the base map layer providing geographical data.
- **OpenRouteService API**: Utilized for geocoding, reverse geocoding, routing, and isochrone services, which form the core functionalities of the project.

### Functionality

IsoRouteMap is designed with simplicity focusing more on functionality than aesthetics. The main features include:

- **Isochrone Visualization**: Users can place a marker on the map to generate isochrones, visual representations of areas accessible within certain time or distance limits from a starting point. The application allows adjustments to the range and intervals of the isochrones.
- **Multi-modal Routing**: The application supports routing for different modes of transportation including bicycles, cars, buses, and walking. Users can select start and end points either by placing markers directly on the map or by searching for locations using the integrated search bar.
- **Dynamic Interactions**: The map panel is equipped with three tabs that allow users to switch between searching locations, planning routes, and generating isochrones.
- **Geocoding and Reverse Geocoding**: Integrated with OpenRouteService API, it allows users to search for places and also to find names of locations by clicking on the map.

### Use Case

This project is particularly useful for urban planners, cyclists, and casual users who need to visualize travel times and plan routes across multiple transportation modes. It's also a tool for developers to understand the integration of various APIs with Leaflet maps in a TypeScript project.

### Project Structure

The project is structured into various components, each handling specific aspects of the application:
- **ors-api**: This includes classes that handle API calls for routing, geocoding, and isochrone generation.
- **components**: Contains UI components like maps, search bars, and panels which interact with the APIs to render the map, display routes, handle search results, and display isochrones.
- **eventBus**: Facilitates communication between components, enabling a reactive user interface.

Files:
- 📁 **root**
  - `package-lock.json`
  - `package.json`
  - `README.md.txt`
  - `tsconfig.json`
  - `webpack.config.js`
  - 📁 **build-utils**
    - `loadPresets.js`
    - `webpack.development.js`
    - `webpack.production.js`
    - 📁 **presets**
      - `webpack.serviceworker.js`
  - 📁 **src**
    - `index.html`
    - `index.ts`
    - `styles.css`
    - 📁 **components**
      - 📁 **ors-custom-contextmenu**
        - `index.ts`
        - `ors-custom-contextmenu.ts`
      - 📁 **ors-isochrone-tab**
        - `index.ts`
        - `ors-isochrone-tab.ts`
      - 📁 **ors-map**
        - `index.ts`
        - `ors-map.ts`
        - 📁 **assets**
          - 📁 **img**
            - `index.d.ts`
            - `marker-icon-green.png`
            - `marker-icon-red.png`
      - 📁 **ors-panel**
        - `index.ts`
        - `ors-panel.ts`
      - 📁 **ors-progress-bar**
        - `index.ts`
        - `ors-progress-bar.ts`
      - 📁 **ors-route-selector**
        - `index.ts`
        - `ors-route-selector.ts`
      - 📁 **ors-route-tab**
        - `index.ts`
        - `ors-route-tab.ts`
      - 📁 **ors-search**
        - `index.ts`
        - `ors-search.ts`
    - 📁 **event**
      - `eventBus.ts`
    - 📁 **ors-api**
      - `config.ts`
      - `index.ts`
      - `ors-api.ts`
