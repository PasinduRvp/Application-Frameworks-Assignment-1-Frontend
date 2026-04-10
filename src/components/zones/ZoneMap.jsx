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

const MapLegend = () => (
    <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 min-w-[180px]">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Protection Levels</h4>
        <div className="space-y-2.5">
            {PROTECTION_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center gap-3">
                    <div
                        className="w-3.5 h-3.5 rounded-full border shadow-sm"
                        style={{
                            backgroundColor: level.color === 'red' ? '#ef4444' :
                                level.color === 'orange' ? '#f97316' :
                                    level.color === 'yellow' ? '#eab308' : '#3b82f6',
                            borderColor: level.color === 'red' ? '#b91c1c' :
                                level.color === 'orange' ? '#c2410c' :
                                    level.color === 'yellow' ? '#a16207' : '#1d4ed8'
                        }}
                    />
                    <span className="text-sm font-medium text-gray-700">{level.label}</span>
                </div>
            ))}
            <div className="flex items-center gap-3 mt-1 pt-2 border-t border-gray-100">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-red-600 bg-red-100 animate-pulse" />
                <span className="text-sm font-bold text-red-600">Emergency</span>
            </div>
        </div>
    </div>
);

const ZoneMap = ({ zones = [], focusedZone = null }) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [hoveredZoneId, setHoveredZoneId] = React.useState(null);

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
            <h3 className="font-bold text-lg text-ocean-900 border-b pb-1 mb-2">
                {zone.name}
                {zone.isEmergency && (
                    <span className="ml-2 bg-red-600 text-white text-[10px] uppercase px-2 py-0.5 rounded-full animate-pulse">
                        Emergency
                    </span>
                )}
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm flex items-center gap-1.5 text-ocean-700 font-bold">
                        <Shield size={14} />
                        <span className="capitalize">{zone.zoneType.replace(/_/g, ' ')}</span>
                    </p>
                    {zone.zoneType === 'other' && zone.customZoneType && (
                        <span className="bg-ocean-100 text-ocean-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-ocean-200">
                            {zone.customZoneType}
                        </span>
                    )}
                </div>

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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Fish size={10} /> Protected Species
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {zone.marineSpecies.map((s, i) => (
                                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {zone.description && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-[11px] text-gray-500 leading-relaxed italic line-clamp-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
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
                <MapLegend />
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
                    const isHovered = hoveredZoneId === zone._id;

                    // Calculate a simple centroid for the marker
                    const latSum = positions.reduce((sum, p) => sum + p[0], 0);
                    const lngSum = positions.reduce((sum, p) => sum + p[1], 0);
                    const centroid = [latSum / positions.length, lngSum / positions.length];

                    return (
                        <React.Fragment key={zone._id}>
                            <Polygon
                                positions={positions}
                                eventHandlers={{
                                    mouseover: () => setHoveredZoneId(zone._id),
                                    mouseout: () => setHoveredZoneId(null),
                                }}
                                pathOptions={{
                                    fillColor: zone.isEmergency ? '#dc2626' : style.fillColor,
                                    fillOpacity: zone.isEmergency ? 0.4 : (isFocused || isHovered ? 0.4 : 0.2),
                                    color: zone.isEmergency ? '#991b1b' : style.color,
                                    weight: zone.isEmergency ? 4 : (isFocused || isHovered ? 3 : 1),
                                    dashArray: zone.isEmergency ? '1, 10' : (isFocused || isHovered ? '0' : '5, 5'),
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
        </div >
    );
};

export default ZoneMap;
