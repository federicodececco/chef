"use client";
import { Map as LeafletMap, Circle, Marker, LatLng } from "leaflet";
import { useState, useEffect, useRef, useCallback } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface CityMapSelector {
  city: string;
  setCity: (city: string) => void;
}

/* leaflet */
declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

export default function CityMapSelector({ setCity }: CityMapSelector) {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [selectedCity, setSelectedCity] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState<number>(5000);
  const [cityName, setCityName] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const circleRef = useRef<Circle | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const addCityMarker = useCallback(
    (
      latlng: Coordinates,
      mapInstance: LeafletMap,
      L: typeof import("leaflet"),
    ) => {
      if (markerRef.current) mapInstance.removeLayer(markerRef.current);
      if (circleRef.current) mapInstance.removeLayer(circleRef.current);

      const newMarker = L.marker([latlng.lat, latlng.lng]).addTo(mapInstance);
      const newCircle = L.circle([latlng.lat, latlng.lng], {
        radius: radius,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(mapInstance);

      markerRef.current = newMarker;
      circleRef.current = newCircle;
      setSelectedCity(latlng);

      mapInstance.setView([latlng.lat, latlng.lng], 12);

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            "Località sconosciuta";
          setCityName(city);

          newMarker.bindPopup("").openPopup();
        })
        .catch((err) => {
          console.error("Errore geocoding:", err);
          setCityName("Località sconosciuta");
        });
    },
    [radius],
  );

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    const initMap = () => {
      if (typeof window !== "undefined" && window.L) {
        const L = window.L;
        const mapInstance = L.map("map").setView([41.9028, 12.4964], 6);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapInstance);

        setMap(mapInstance);
        setIsMapReady(true);

        mapInstance.on("click", (e: { latlng: LatLng }) => {
          addCityMarker(
            { lat: e.latlng.lat, lng: e.latlng.lng },
            mapInstance,
            L,
          );
        });
      }
    };

    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      if (map) map.remove();
    };
  }, [addCityMarker, map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPopupContent(
        `<b>${cityName || "Città selezionata"}</b><br>Raggio: ${(
          radius / 1000
        ).toFixed(1)} km`,
      );
    }
  }, [radius, cityName]);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
  };

  const saveLocation = () => {
    if (!selectedCity || !cityName) {
      return;
    }

    console.log("Location saved:", {
      city: cityName,
      coordinates: selectedCity,
      radiusKm: (radius / 1000).toFixed(1),
    });

    setCity(cityName);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const clearLocation = () => {
    if (markerRef.current && map) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    if (circleRef.current && map) {
      map.removeLayer(circleRef.current);
      circleRef.current = null;
    }
    setSelectedCity(null);
    setCityName("");
    setCity("");
  };

  return (
    <div className="col-span-2 flex h-200 w-full flex-col">
      {showToast && (
        <div className="toast toast-top toast-center mt-20">
          <div className="alert alert-info border-gold bg-gold">
            <span>Posizione Salvata</span>
          </div>
        </div>
      )}
      <div className="flex-col bg-[#232323] p-4 shadow-md">
        <h1 className="text-2xl font-bold">
          Seleziona la città e il raggio in cui vuoi operare
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1"></div>
          <div className="w-full">
            <label className="block text-sm font-medium text-[#c8a36a]">
              Raggio zona: {(radius / 1000).toFixed(1)} km
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={radius}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              className="w-full lg:max-w-1/4"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {isMapReady ? "" : "Caricamento mappa..."}
        </p>
        {selectedCity && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={saveLocation}
              className="rounded-lg bg-[#c8a36a] px-6 py-2 font-medium text-[#0a0a0a] transition hover:bg-[#d4b480]"
            >
              Salva Posizione
            </button>
            <button
              onClick={clearLocation}
              className="rounded-lg border border-[#c8a36a] px-6 py-2 font-medium text-[#c8a36a] transition hover:bg-red-600 hover:text-white"
            >
              Cancella
            </button>
          </div>
        )}
      </div>

      <div id="map" className="z-1 w-full flex-1" />
    </div>
  );
}
