import config from "./config";

export class OrsApi {
  constructor() {}

  async reverseGeocode(coordinates: L.LatLng): Promise<string> {
    const { apiKey, reverseGeocodeUrl } = config;

    const requestUrl: string = `${reverseGeocodeUrl}api_key=${apiKey}&point.lon=${coordinates.lng}&point.lat=${coordinates.lat}`;
    const response = await fetch(requestUrl);
    const data = await response.json();

    return data.features[0].properties.label;
  }

  async route(
    origin: L.LatLng,
    destination: L.LatLng,
    travelProfile: string = "driving-car"
  ): Promise<object> {
    const { apiKey, routeServiceUrl } = config;

    const originCoords: string = `${origin.lng},${origin.lat}`;
    const destinationCoords: string = `${destination.lng},${destination.lat}`;

    const serviceUrl: string = `${routeServiceUrl}${travelProfile}?api_key=${apiKey}&start=${originCoords}&end=${destinationCoords}`;

    const routeResponse = await fetch(serviceUrl);
    const routeData = await routeResponse.json();

    return routeData;
  }

  async isochrone(center: L.LatLng, maxRange: number = 15000, interval: number = 3000): Promise<GeoJSON.FeatureCollection<GeoJSON.Polygon>> {
    const { apiKey, isochroneServiceUrl } = config;
  
    // Explicitly define ranges as an array of numbers
    let ranges: number[] = [];
    for(let range = interval; range <= maxRange; range += interval) {
      ranges.push(range);
    }
  
    const body = {
      locations: [[center.lng, center.lat]],
      range: ranges, // Use the ranges array here
      range_type: "distance",
    };
  
    const response = await fetch(isochroneServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
  
    // Check if the response is valid GeoJSON
    if (!data || !data.features) {
      throw new Error('Invalid GeoJSON data');
    }
  
    // Return data with explicit type assertion
    return data as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  }
  
  




  

  async geocode(query: string): Promise<string[]> {
    const { apiKey, geocodeServiceUrl } = config;
    const geocodeUrl = `${geocodeServiceUrl}api_key=${apiKey}&text=${query}`;

    try {
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      return geocodeData.features;
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return [];
    }
  }
}
