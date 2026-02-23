import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, Shield, Fish, AlertCircle, Info } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PROTECTION_LEVELS } from '../../utils/constants';

// Custom Shield Icon for Markers
const createShieldIcon = (color) => {
    const iconMarkup = renderToStaticMarkup(
        <div className={`p-1 rounded-full border-2 bg-white shadow-md`} style={{ borderColor: color, color: color }}>
            <Shield size={20} fill={color} fillOpacity={0.2} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-shield-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

// Component to handle map centering and programmatic movement
const MapController = ({ zones, focusedZone }) => {
    const map = useMap();

    useEffect(() => {
        if (focusedZone) {
            const coords = focusedZone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
            const bounds = L.latLngBounds(coords);
            map.flyToBounds(bounds, { padding: [100, 100], duration: 1.5 });
        } else if (zones && zones.length > 0) {
            const allCoords = zones.flatMap(zone =>
                zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]])
            );
            if (allCoords.length > 0) {
                const bounds = L.latLngBounds(allCoords);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [map, zones, focusedZone]);

    return null;
};

const ZoneMap = ({ zones = [], focusedZone = null }) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const getZoneStyle = (level) => {
        const config = PROTECTION_LEVELS.find(p => p.value === level);
        switch (config?.color) {
            case 'red':
                return { fillColor: '#ef4444', color: '#b91c1c' };
            case 'orange':
                return { fillColor: '#f97316', color: '#c2410c' };
            case 'yellow':
                return { fillColor: '#eab308', color: '#a16207' };
            default:
                return { fillColor: '#3b82f6', color: '#1d4ed8' };
        }
    };

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    const ZonePopupContent = ({ zone }) => (
        <div className="p-2 min-w-[200px]">
            <h3 className="font-bold text-lg text-ocean-900 border-b pb-1 mb-2">{zone.name}</h3>
            <div className="space-y-3">
                <p className="text-sm flex items-center gap-1.5 text-gray-700">
                    <Shield size={14} className="text-ocean-500" />
                    <span className="font-semibold capitalize">{zone.zoneType.replace(/_/g, ' ')}</span>
                </p>

                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${zone.riskLevel > 7 ? 'bg-red-100 text-red-700' :
                        zone.riskLevel > 4 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        <AlertCircle size={12} />
                        Risk: {zone.riskLevel}/10
                    </span>
                    {zone.speedLimit && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {zone.speedLimit} kn Limit
                        </span>
                    )}
                </div>

                {zone.marineSpecies && zone.marineSpecies.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-2">
                            <Fish size={14} /> Protected Biodiversity
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {zone.marineSpecies.map((s, i) => (
                                <span key={i} className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {zone.description && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                            {zone.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 transition-all duration-500 ease-in-out ${isFullscreen ? 'fixed inset-0 z-[9999] h-screen w-screen' : 'h-[500px]'}`}>
            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-[1000] p-3 bg-white hover:bg-gray-50 rounded-xl shadow-lg border border-gray-200 text-ocean-600 transition-transform active:scale-95"
                title={isFullscreen ? 'Exit Fullscreen' : 'View Large Map'}
            >
                {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                className="h-full w-full"
            >
                {/* Esri World Ocean Base Layer (Bathymetry/Depths) */}
                <TileLayer
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                />

                {/* OpenSeaMap Overlay (Nautical markers, buoys, beacons) */}
                <TileLayer
                    url="https://tile.openseamap.org/seamap/{z}/{x}/{y}.png"
                    attribution='Map data &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                />

                {zones.map((zone) => {
                    const positions = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                    const style = getZoneStyle(zone.protectionLevel);
                    const isFocused = focusedZone?._id === zone._id;

                    // Calculate a simple centroid for the marker
                    const latSum = positions.reduce((sum, p) => sum + p[0], 0);
                    const lngSum = positions.reduce((sum, p) => sum + p[1], 0);
                    const centroid = [latSum / positions.length, lngSum / positions.length];

                    return (
                        <React.Fragment key={zone._id}>
                            <Polygon
                                positions={positions}
                                pathOptions={{
                                    fillColor: style.fillColor,
                                    fillOpacity: isFocused ? 0.4 : 0.2,
                                    color: style.color,
                                    weight: isFocused ? 3 : 1,
                                    dashArray: isFocused ? '5, 10' : '5, 5',
                                }}
                            >
                                <Popup>
                                    <ZonePopupContent zone={zone} />
                                </Popup>
                            </Polygon>

                            <Marker
                                position={centroid}
                                icon={createShieldIcon(style.color)}
                            >
                                <Popup>
                                    <ZonePopupContent zone={zone} />
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                <MapController zones={zones} focusedZone={focusedZone} />
            </MapContainer>
        </div>
    );
};

export default ZoneMap;
