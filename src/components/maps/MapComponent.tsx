'use client'

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'

interface MapComponentProps {
  latitude: number
  longitude: number
  title: string
}

/**
 * NOTA SOBRE ESTILOS DEL MAPA:
 *   @vis.gl/react-google-maps usa `mapId` (ver prop abajo). Los estilos
 *   personalizados (colores de carretera, agua, etc.) se configuran en
 *   Google Cloud Console, asociados a ese mapId — NO como prop.
 *
 *   Para personalizar:
 *   1. Ve a https://console.cloud.google.com/google/maps-apis/studio
 *   2. Crea un "Map Style" con los colores de tu marca
 *   3. Asóciale el mapId `casa-seis-map`
 *
 *   Antes este componente pasaba una prop `styles={...}` que NO existe
 *   en esta librería (quedaba ignorada y producía warning de TypeScript).
 */
export default function MapComponent({ latitude, longitude, title }: MapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="w-full h-80 bg-stone-100 flex items-center justify-center border border-stone-200">
        <p className="text-sm text-stone-400">Mapa no disponible</p>
      </div>
    )
  }

  const position = { lat: latitude, lng: longitude }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-80 overflow-hidden">
        <Map
          defaultCenter={position}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapId="casa-seis-map"
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker position={position} title={title}>
            <Pin
              background="#1e2c56"
              borderColor="#0f1530"
              glyphColor="#ffffff"
              scale={1.2}
            />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  )
}
